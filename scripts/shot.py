#!/usr/bin/env python3
"""Headless Chrome screenshot helper (CDP over websocket).

Usage:
  python3 scripts/shot.py <url> <out_prefix> [--width 1440] [--height 900] [--full]

Requires: websocket-client, Google Chrome installed at /Applications.
"""
import base64
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.request

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 9333
PROFILE = "/tmp/_shot_profile"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def _http(path):
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open(f"http://127.0.0.1:{PORT}{path}", timeout=10) as r:
        return json.loads(r.read().decode())


class CDP:
    def __init__(self, ws_url):
        import websocket

        self.ws = websocket.create_connection(ws_url, timeout=60)
        self._id = 0

    def send(self, method, params=None, wait=True):
        self._id += 1
        mid = self._id
        self.ws.send(json.dumps({"id": mid, "method": method, "params": params or {}}))
        if not wait:
            return None
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == mid:
                if "error" in msg:
                    raise RuntimeError(f"{method}: {msg['error']}")
                return msg.get("result", {})

    def eval(self, expr):
        r = self.send(
            "Runtime.evaluate",
            {"expression": expr, "returnByValue": True, "awaitPromise": True},
        )
        return r.get("result", {}).get("value")

    def close(self):
        try:
            self.ws.close()
        except Exception:
            pass


def launch():
    shutil.rmtree(PROFILE, ignore_errors=True)
    proc = subprocess.Popen(
        [
            CHROME,
            "--headless=new",
            f"--remote-debugging-port={PORT}",
            f"--user-data-dir={PROFILE}",
            "--hide-scrollbars",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-gpu",
            "--force-device-scale-factor=1",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    for _ in range(80):
        try:
            _http("/json/version")
            return proc
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chrome did not expose the debugging port")


def main():
    url = sys.argv[1]
    prefix = sys.argv[2]
    width = 1440
    height = 900
    full = "--full" in sys.argv
    if "--width" in sys.argv:
        width = int(sys.argv[sys.argv.index("--width") + 1])
    if "--height" in sys.argv:
        height = int(sys.argv[sys.argv.index("--height") + 1])

    proc = launch()
    try:
        targets = _http("/json/list")
        pages = [t for t in targets if t.get("type") == "page"]
        if not pages:
            raise RuntimeError("no page target")
        target = pages[0]
        cdp = CDP(target["webSocketDebuggerUrl"])
        cdp.send("Page.enable")
        cdp.send(
            "Emulation.setDeviceMetricsOverride",
            {"width": width, "height": height, "deviceScaleFactor": 1, "mobile": False},
        )
        cdp.send("Page.navigate", {"url": url})
        time.sleep(3.0)
        cdp.eval("document.fonts && document.fonts.ready ? document.fonts.ready.then(()=>1) : 1")
        time.sleep(0.6)

        metrics = cdp.send("Page.getLayoutMetrics")
        content = metrics.get("cssContentSize") or metrics["contentSize"]
        total_h = int(content["height"])
        print(f"content size: {width} x {total_h}")

        if full:
            shot = cdp.send(
                "Page.captureScreenshot",
                {
                    "format": "png",
                    "captureBeyondViewport": True,
                    "clip": {"x": 0, "y": 0, "width": width, "height": total_h, "scale": 1},
                },
            )
            out = f"{prefix}-full.png"
            with open(out, "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            print(f"saved {out}")

        # viewport slices for detailed inspection
        n = 0
        y = 0
        while y < total_h and n < 12:
            cdp.eval(f"window.scrollTo(0, {y})")
            time.sleep(0.45)
            shot = cdp.send("Page.captureScreenshot", {"format": "png"})
            out = f"{prefix}-vp{n:02d}.png"
            with open(out, "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            n += 1
            y += height
        print(f"saved {n} viewport slices")
        cdp.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except Exception:
            proc.kill()


if __name__ == "__main__":
    import urllib.parse  # noqa: E402

    main()
