// Part of Inspector Bokeh by @timotgl
// MIT License - Copyright (c) 2016 Timo Taglieber <github@timotaglieber.de>
// https://github.com/timotgl/inspector-bokeh

import measureBlur from './measureBlur.js';

onmessage = (messageEvent) => {
  postMessage({
    score: measureBlur(messageEvent.data.imageData),
  });
};
