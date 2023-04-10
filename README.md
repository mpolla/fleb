# FLEB - Fast Log Entry in-Browser

FLEB is a web application for efficient plaintext ham radio contact logging. Write contact logs
as you would on pen and paper - or digitize existing paper logs.

Original implementation for Windows, see https://df3cb.com/fle/

## Features

Feature comparison with [FLE by DF2CB](https://df3cb.com/fle/documentation/)

| Feature                       | FLEB | FLE by DF3CB |
|-------------------------------|------|--------------|
| Regular logging               | ✅   | ✅           |
| Contest logging               | ❌   | ✅           |
| WWFF logging                  | ✅   | ✅           |
| SOTA logging                  | ✅   | ✅           |
| POTA loggin                   | ❌   | ✅           |
| Off-line or real-time logging | ❌   | ✅           |
| Interpolation of log times    | ✅   | ✅           |
| ADIF export                   | ✅   | ✅           |
| CSV export                    | ✅   | ✅           |
| LoTW and eQSL upload          | ❌   | ✅           |
| Keyboard shortcuts            | ❌   | ✅           |

## TODO

- Improved date/time validation
- Link call signs to qrz.com
- Offline operation
- POTA logging

## Run locally

    npm start
