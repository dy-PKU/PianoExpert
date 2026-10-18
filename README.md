# PianoExpert

**PianoExpert: Event-Level Optimization for Long-Horizon Dexterous Piano Performance**

Yu Du ? Peking University ? Beijing, China  
[duyu26@stu.pku.edu.cn](mailto:duyu26@stu.pku.edu.cn)

The project page contains the Abstract and ten simulation performances.

## Publication

GitHub Pages project URL: https://dy-pku.github.io/PianoExpert/

The workflow publishes the static `site/` directory when `main` changes. In repository Settings ? Pages, select **GitHub Actions** as the publishing source. All links are relative, including HLS manifests and media fragments, so the page supports this project subdirectory as well as a user or organization Pages site.

To preview: `python -m http.server 8769 --directory site`.

Video playback uses same-origin HLS and locally vendored hls.js. The hls.js license is in `site/assets/hls-LICENSE.txt`. Safari uses native HLS when supported. Other supported browsers use Media Source Extensions. The video fragments preserve the compressed video and audio packets of the provided performances.
