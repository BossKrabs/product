# Runtime provenance

This package depends directly on the original author's published package **dsh-dafeiyu@0.1.22**, https://github.com/QCYTSN/dsh-dafeiyu . It reuses that package's CompanionReducer and HelperProcess; it does not redistribute a renamed copy of the upstream plugin or register its original bundle.

At activation on Windows x64, the original prebuilt helper is copied byte-for-byte from that dependency to this plugin's own runtime directory, alongside this package's Madara frames. The original plugin directory, BigFish assets, settings, endpoints and cache are not modified. The helper's configuration environment variables retain their upstream names for binary compatibility.

The settings adapter is adapted from QCYTSN/dsh-dafeiyu, Copyright (c) 2026 QCYTSN, MIT. The upstream MIT license is included below. Its generated notification sounds are MIT; Chromium glove cursors are BSD-3-Clause, with the upstream license/provenance copied to the runtime assets. Python, Qt and PySide6 runtime licenses remain those of the original helper and its upstream distribution.

MIT License

Copyright (c) 2026 QCYTSN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

