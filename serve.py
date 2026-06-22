from __future__ import annotations

import argparse
import os
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class UTF8StaticHandler(SimpleHTTPRequestHandler):
    """Static-file handler that explicitly declares UTF-8 for text assets."""

    def guess_type(self, path: str) -> str:
        content_type = super().guess_type(path)
        if content_type.startswith("text/") and "charset=" not in content_type:
            return f"{content_type}; charset=utf-8"
        if content_type in {"application/json", "application/javascript", "application/xml"}:
            return f"{content_type}; charset=utf-8"
        return content_type


def main() -> None:
    os.chdir(Path(__file__).resolve().parent)
    parser = argparse.ArgumentParser(description="Serve the QA portfolio with UTF-8 text headers.")
    parser.add_argument("port", nargs="?", type=int, default=8000)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("", args.port), UTF8StaticHandler)
    print(f"Portfolio server: http://localhost:{args.port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPortfolio server stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
