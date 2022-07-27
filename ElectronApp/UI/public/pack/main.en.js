__mm["UI/Functions/Debounce"] = function (global, exports) {
  class Debounce {
    constructor(func, delay) {
      this.onRun = func;
      this.delay = delay || 250;
    }

    handle(args) {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.onRun(args);
      }, this.delay);
    }

  }

  exports.default = Debounce;
};__mm["UI/Paginator"] = function (global, exports) {
  var id = 1;
  var initialised = false;

  class Paginator extends React.Component {
    constructor(props) {
      super(props);
      this.newId();
      this.paginator = React.createRef();
      this.state = {
        scrollPref: this.props.scrollPref
      };
    }

    componentWillReceiveProps(props) {
      this.newId();
    }

    componentDidMount() {
      if (initialised) {}
    }

    newId() {
      this.fieldId = 'paginator_' + id++;
    }

    performScroll() {
      switch (this.state.scrollPref) {
        case "none":
          break;

        case "self":
          this.checkVisible();
          break;

        default:
          global.scrollTo && global.scrollTo(0, 0);
          break;
      }
    }

    checkVisible() {
      var paginator = this.paginator.current;

      if (!paginator) {
        return;
      }

      var bounding = paginator.getBoundingClientRect();

      if (bounding.top >= 0 && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)) {
        return;
      }

      paginator.scrollIntoView({
        block: "end"
      });

      if (window.matchMedia('(max-width: 752px) and (pointer: coarse) and (orientation: portrait)').matches || window.matchMedia('(max-height: 752px) and (pointer: coarse) and (orientation: landscape)').matches) {
        global.scrollBy && global.scrollBy(0, 80);
      }
    }

    changePage(newPageId) {
      initialised = true;

      try {
        var nextPage = parseInt(newPageId);

        if (!nextPage || nextPage <= 0) {
          nextPage = 1;
        }

        var totalPages = this.getTotalPages();

        if (totalPages && nextPage > totalPages) {
          nextPage = totalPages;
        }

        this.props.onChange && this.props.onChange(nextPage, this.props.pageIndex);
      } catch (_unused) {
        return;
      }
    }

    getTotalPages() {
      var {
        totalResults,
        pageSize
      } = this.props;

      if (totalResults) {
        return Math.ceil(totalResults / pageSize);
      }

      return 0;
    }

    renderPage(page, currentPage, totalPages) {
      var isCurrentPage = page == currentPage;
      var pageClass = isCurrentPage ? "page-item active" : "page-item";
      var isEmpty = page < 1 || page > totalPages;
      return _h("li", {
        className: pageClass
      }, !isCurrentPage && !isEmpty && _h("button", {
        type: "button",
        className: "page-link",
        onClick: () => this.changePage(page)
      }, page), isCurrentPage && !isEmpty && _h("span", {
        className: "page-link"
      }, page), isEmpty && _h("span", {
        className: "page-link empty"
      }, "\xA0"));
    }

    renderPageLinks(pageRange, currentPage, totalPages) {
      return pageRange.map(page => this.renderPage(page, currentPage, totalPages));
    }

    render() {
      var {
        pageIndex
      } = this.props;
      var totalPages = this.getTotalPages();

      if (!this.props.always && totalPages && totalPages < 2) {
        return null;
      }

      var currentPage = this.props.pageIndex || 1;

      if (!pageIndex || pageIndex <= 0) {
        pageIndex = 1;
      }

      if (totalPages && pageIndex > totalPages) {
        pageIndex = totalPages;
      }

      var description = this.props.description || `Results`;
      var firstIcon = this.props.firstIcon || "fas fa-fast-backward";
      var prevIcon = this.props.prevIcon || "fas fa-play fa-xs fa-flip-horizontal";
      var nextIcon = this.props.nextIcon || "fas fa-play fa-xs";
      var lastIcon = this.props.lastIcon || "fas fa-fast-forward";
      var showInput = this.props.showInput !== undefined ? this.props.showInput : true;
      var maxLinks = this.props.maxLinks || 5;
      var isMobile = false;
      var showFirstLastNav = true;
      var showPrevNextNav = true;

      if (isMobile) {
        maxLinks = 3;
      }

      var fromPage, toPage;

      if (maxLinks % 2 == 0) {
        fromPage = currentPage - (maxLinks / 2 - 1);
        toPage = currentPage + maxLinks / 2;
      } else {
        fromPage = currentPage - (maxLinks - 1) / 2;
        toPage = currentPage + (maxLinks - 1) / 2;
      }

      while (fromPage < 1) {
        fromPage++;
        toPage++;
      }

      while (toPage > totalPages) {
        toPage--;
      }

      while (totalPages >= maxLinks && toPage - fromPage + 1 < maxLinks) {
        fromPage--;
      }

      var pageRange = [];

      for (var i = fromPage; i <= toPage; i++) {
        pageRange.push(i);
      }

      return _h("nav", {
        className: "paginator",
        "aria-label": description,
        ref: this.paginator
      }, _h("ul", {
        className: "pagination"
      }, showFirstLastNav && _h("li", {
        className: "page-item first-page"
      }, _h("button", {
        type: "button",
        className: "page-link",
        onClick: () => this.changePage(1),
        disabled: currentPage <= 1,
        title: `First page`
      }, _h("i", {
        className: firstIcon
      }), _h("span", {
        className: "sr-only"
      }, `First page`))), showPrevNextNav && _h("li", {
        className: "page-item prev-page"
      }, _h("button", {
        type: "button",
        className: "page-link",
        onClick: () => this.changePage(currentPage - 1),
        disabled: currentPage <= 1,
        title: `Previous page`
      }, _h("i", {
        className: prevIcon
      }), _h("span", {
        className: "sr-only"
      }, `Previous page`))), this.renderPageLinks(pageRange, currentPage, totalPages), showPrevNextNav && _h("li", {
        className: "page-item next-page"
      }, _h("button", {
        type: "button",
        className: "page-link",
        onClick: () => this.changePage(currentPage + 1),
        disabled: currentPage == totalPages,
        title: `Next page`
      }, _h("i", {
        className: nextIcon
      }), _h("span", {
        className: "sr-only"
      }, `Next page`))), showFirstLastNav && _h("li", {
        className: "page-item last-page"
      }, _h("button", {
        type: "button",
        className: "page-link",
        onClick: () => this.changePage(totalPages),
        disabled: currentPage == totalPages,
        title: `Last page`
      }, _h("i", {
        className: lastIcon
      }), _h("span", {
        className: "sr-only"
      }, `Last page`)))), _h("div", {
        className: "pagination-overview"
      }, showInput && _h(React.Fragment, null, _h("label", {
        className: "page-label",
        for: this.props.id || this.fieldId
      }, `Viewing page`), _h("input", {
        className: "form-control",
        type: "text",
        id: this.props.id || this.fieldId,
        value: this.props.pageIndex || '1',
        onkeyUp: e => {
          if (e.keyCode == 13) {
            this.changePage(e.target.value);
          }
        }
      }), !!totalPages && _h("span", {
        className: "field-label"
      }, " of ", totalPages)), !showInput && _h("p", {
        className: "field-label"
      }, "Viewing page ", currentPage, !!totalPages && _h("span", null, " of ", totalPages))));
    }

  }

  exports.default = Paginator;
  Paginator.propTypes = {
    always: 'bool'
  };
};__mm["UI/Icon"] = function (global, exports) {
  function Icon(props) {
    const {
      type,
      count,
      light,
      solid,
      duotone,
      regular,
      brand,
      fixedWidth
    } = props;
    var variant = 'fa';

    if (light) {
      variant = 'fal';
    } else if (duotone) {
      variant = 'fad';
    } else if (brand) {
      variant = 'fab';
    } else if (regular) {
      variant = 'far';
    } else if (solid) {
      variant = 'fas';
    }

    var className = variant + " fa-" + type;

    if (fixedWidth) {
      className += " fa-fw";
    }

    if (props.count) {
      return _h("span", {
        className: "fa-layers fa-fw"
      }, _h("i", {
        className: className
      }), _h("span", {
        className: "fa-layers-counter"
      }, count));
    }

    return _h("i", {
      className: className
    });
  }

  exports.default = Icon;
};__mm["UI/Functions/Validation/EmailAddress"] = function (global, exports) {
  const Text = _rq("UI/Text").default;

  exports.default = value => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test(String(value).toLowerCase())) {
      return {
        error: 'FORMAT',
        ui: _h(Text, null, `Please provide a valid email address`)
      };
    }
  };
};__mm["UI/Text"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Text(props) {
    const {
      paragraph,
      bold,
      className,
      animation,
      animationDirection
    } = props;
    const omitProps = ['text', 'children', 'paragraph', 'bold', 'className', 'animation', 'animationDirection'];
    var anim = animation ? animation : undefined;

    switch (anim) {
      case 'fade':
      case 'zoom-in':
      case 'zoom-out':
        if (animationDirection) {
          anim += "-" + animationDirection;
        }

        break;

      case 'flip':
      case 'slide':
        if (animationDirection) {
          anim += "-" + animationDirection;
        } else {
          anim += "-up";
        }

        break;
    }

    var Tag = paragraph ? "p" : "span";

    if (bold && !paragraph) {
      Tag = "strong";
    }

    if (bold && paragraph) {
      return _h("p", {
        className: className,
        "data-aos": anim,
        ...omit(props, omitProps)
      }, _h("strong", {
        dangerouslySetInnerHTML: {
          __html: props.text || props.children
        }
      }));
    }

    return _h(Tag, {
      className: className,
      "data-aos": anim,
      dangerouslySetInnerHTML: {
        __html: props.text || props.children
      },
      ...omit(props, omitProps)
    });
  }

  exports.default = Text;
  Text.propTypes = {
    paragraph: 'boolean',
    bold: 'boolean',
    className: 'string',
    animation: [{
      name: 'None',
      value: null
    }, {
      name: 'Fade',
      value: 'fade'
    }, {
      name: 'Flip',
      value: 'flip'
    }, {
      name: 'Slide',
      value: 'slide'
    }, {
      name: 'Zoom in',
      value: 'zoom-in'
    }, {
      name: 'Zoom out',
      value: 'zoom-out'
    }],
    animationDirection: [{
      name: 'Static',
      value: null
    }, {
      name: 'Up',
      value: 'up'
    }, {
      name: 'Down',
      value: 'down'
    }, {
      name: 'Left',
      value: 'left'
    }, {
      name: 'Right',
      value: 'right'
    }]
  };
  Text.defaultProps = {
    paragraph: false,
    bold: false,
    animation: 'none',
    animationDirection: 'static'
  };
  Text.icon = 'align-justify';
  Text.rendererPropTypes = {
    text: 'string',
    paragraph: 'boolean',
    bold: 'boolean',
    className: 'string'
  };
};__mm["UI/Functions/Store"] = function (global, exports) {
  var store = window.localStorage;

  function get(key) {
    var val = store.getItem(key);
    return val ? JSON.parse(val) : null;
  }

  function set(key, value) {
    store.setItem(key, JSON.stringify(value));
  }

  function remove(key) {
    store.removeItem(key);
  }

  exports.default = {
    get,
    set,
    remove
  };
};__mm["UI/Input/Checkbox"] = function (global, exports) {
  function Checkbox(props) {
    var {
      id,
      className,
      label,
      name,
      onChange,
      onClick,
      onBlur,
      invalid,
      checked,
      disabled,
      solid,
      isSwitch
    } = props;

    if (onClick && !onChange) {
      onChange = onClick;
    }

    className = className ? className.split(" ") : [];

    if (isSwitch) {
      checkClass.unshift("form-switch");
    }

    if (invalid) {
      className.push("is-invalid");
    }

    className.unshift("form-check");
    var checkClass = className.join(" ");
    var inputClass = "form-check-input" + (solid ? " form-check-input--solid" : "");
    return _h("div", {
      className: props.readonly ? '' : checkClass
    }, props.readonly ? (props.value === undefined ? props.defaultValue : props.value) ? _h("b", null, "Yes (readonly) ") : _h("b", null, "No (readonly) ") : _h("input", {
      class: inputClass,
      type: "checkbox",
      name: name,
      id: id,
      onChange: onChange,
      onBlur: onBlur,
      checked: checked ? "checked" : undefined,
      disabled: disabled ? "disabled" : undefined,
      value: props.value,
      defaultChecked: props.defaultValue
    }), _h("label", {
      class: "form-check-label",
      htmlFor: id
    }, label));
  }

  exports.default = Checkbox;
  Checkbox.propTypes = {
    isSwitch: 'bool'
  };
  Checkbox.defaultProps = {
    isSwitch: false
  };
  Checkbox.icon = 'check-square';
};__mm["UI/StartScreen"] = function (global, exports) {
  const PageWithSidebar = _rq("UI/PageWithSidebar").default;

  const ProjectList = _rq("UI/ProjectList").default;

  const ProjectSelect = _rq("UI/ProjectSelect").default;

  function StartScreen(props) {
    var sidebar = _h(React.Fragment, null, _h(ProjectList, null));

    return _h(PageWithSidebar, {
      sidebar: sidebar
    }, `Main page content`, _h(ProjectSelect, null));
  }

  exports.default = StartScreen;
};__mm["UI/Functions/WebSocket"] = function (global, exports) {
  const store = _rq("UI/Functions/Store").default;

  const expandIncludes = _rq("UI/Functions/WebRequest").expandIncludes;

  function websocketHandler(opts) {
    opts = opts || {};

    if (opts.reconnectOnUserChange) {
      var __user = null;
      var waitMode = 0;
      document.addEventListener('xsession', e => {
        var {
          user,
          loadingUser
        } = e.state;

        if (!waitMode) {
          if (loadingUser) {
            waitMode = 1;
            loadingUser.then(state => {
              waitMode = 2;
              __user = state.user;
            });
            return;
          } else {
            waitMode = 2;
          }
        }

        if (waitMode == 2 && user != __user) {
          __user = user;

          if (ws) {
            try {
              var _ws = ws;
              ws = null;

              _ws.close();

              setTimeout(() => {
                start();
              }, 100);
            } catch (e) {
              console.log(e);
            }
          }
        }
      });
    }

    var started = false;
    var typeCount = 0;
    var ws;
    var onConnectedMessages = [];
    var messageTypes = {};

    function informStatus(state) {
      tellAllHandlers({
        type: 'status',
        connected: state
      });
    }

    function tellAllHandlers(msg) {
      msg.all = true;

      for (var typeName in messageTypes) {
        var handlers = messageTypes[typeName];

        for (var i = 0; i < handlers.length; i++) {
          handlers[i].method(msg);
        }
      }
    }

    function start() {
      if (ws) {
        return;
      }

      connect();
    }

    function goAgain() {
      setTimeout(function () {
        ws = null;
        start();
      }, 5000);
    }

    var pingInterval = null;

    function setPing() {
      if (pingInterval) {
        return;
      }

      pingInterval = setInterval(function () {
        if (ws && ws.readyState == WebSocket.OPEN) {
          ws.send(Uint8Array.from([1]));
        }
      }, 30000);
    }

    var te8 = null;
    var de8 = null;

    class Reader {
      constructor(bytes) {
        this.bytes = new Uint8Array(bytes);
        this.i = 0;
        this.view = new DataView(this.bytes.buffer);
      }

      next() {
        return this.bytes[this.i++];
      }

      readCompressed() {
        var first = this.next();

        switch (first) {
          case 251:
            return this.readUInt16();

          case 252:
            return this.readUInt24();

          case 253:
            return this.readUInt32();

          case 254:
            return this.readUInt64();

          default:
            return first;
        }
      }

      readBytes(size) {
        var set = new Uint8Array(size);

        for (var i = 0; i < size; i++) {
          set[i] = this.next();
        }

        return set;
      }

      readByte() {
        return this.next();
      }

      readInt16() {
        var val = this.view.getInt16(this.i, true);
        this.i += 2;
        return val;
      }

      readUInt16() {
        return this.next() | this.next() << 8;
      }

      readUInt24() {
        return this.next() | this.next() << 8 | this.next() << 16;
      }

      readInt32() {
        var val = this.view.getInt32(this.i, true);
        this.i += 4;
        return val;
      }

      readUInt32() {
        var val = this.view.getUint32(this.i, true);
        this.i += 4;
        return val;
      }

      readInt64() {
        var val = this.view.getBigInt64(this.i, true);
        this.i += 8;
        return val;
      }

      readUInt64() {
        var val = this.view.getBigUint64(this.i, true);
        this.i += 8;
        return val;
      }

      readUtf8() {
        var size = this.readCompressed();
        return this.readUtf8SizedPlus1(size);
      }

      readUtf8SizedPlus1(size) {
        if (size == 0) {
          return null;
        }

        var bytesArr = this.readBytes(size - 1);

        if (!de8) {
          de8 = new TextDecoder("utf-8");
        }

        return de8.decode(bytesArr);
      }

    }

    class Writer {
      constructor(opcode) {
        this.bytes = [];

        if (opcode) {
          this.writeCompressed(opcode);
          this.writeUInt32(0);
        }
      }

      writeView(dv) {
        var n = new Uint8Array(dv.buffer);

        for (var i = 0; i < n.length; i++) {
          this.bytes.push(n[i]);
        }
      }

      writeUInt32(value) {
        var dataView = new DataView(new ArrayBuffer(4));
        dataView.setUint32(0, value, true);
        this.writeView(dataView);
      }

      writeUInt64(value) {
        var dataView = new DataView(new ArrayBuffer(8));
        dataView.setBigUint64(0, value, true);
        this.writeView(dataView);
      }

      writeUInt16(value) {
        var dataView = new DataView(new ArrayBuffer(2));
        dataView.setUint16(0, value, true);
        this.writeView(dataView);
      }

      writeCompressed(value) {
        var b = this.bytes;

        if (value < 251) {
          b.push(value);
        } else if (value <= 65535) {
          b.push(251);
          b.push(value & 255);
          b.push(value >> 8 & 255);
        } else if (value < 16777216) {
          b.push(252);
          b.push(value & 255);
          b.push(value >> 8 & 255);
          b.push(value >> 16 & 255);
        } else if (value <= 4294967295) {
          b.push(253);
          this.writeUInt32(value);
        } else {
          b.push(254);
          this.writeUInt64(value);
        }
      }

      writeByte(i) {
        this.bytes.push(i);
      }

      writeUtf8(str) {
        if (str === null) {
          this.writeByte(0);
          return;
        }

        if (!te8) {
          te8 = new TextEncoder("utf-8");
        }

        var buf = te8.encode(str);
        this.writeCompressed(buf.length + 1);

        for (var i = 0; i < buf.length; i++) {
          this.bytes.push(buf[i]);
        }
      }

      toBuffer() {
        return Uint8Array.from(this.bytes);
      }

      setSize() {
        var b = this.bytes;
        var opcodeSize = 1;
        var value = b.length - (4 + opcodeSize);
        b[opcodeSize] = value & 255;
        b[opcodeSize + 1] = value >> 8 & 255;
        b[opcodeSize + 2] = value >> 16 & 255;
        b[opcodeSize + 3] = value >> 24 & 255;
      }

    }

    function getAsBuffer(obj) {
      if (obj && obj.toBuffer) {
        obj.setSize();
        return obj.toBuffer();
      }

      var json = JSON.stringify(obj);
      var w = new Writer();
      w.writeByte(2);
      w.writeUtf8(json);
      return w.toBuffer();
    }

    function connect() {
      if (typeof WebSocket === "undefined") {
        return;
      }

      var sk = new WebSocket(opts.url);
      sk.binaryType = "arraybuffer";
      ws = sk;
      setPing();
      sk.addEventListener("open", () => {
        if (ws != sk) {
          return;
        }

        informStatus(true);
        var msgs = onConnectedMessages;
        onConnectedMessages = [];

        if (global.storedToken) {
          sk.send(getAsBuffer({
            type: 'Auth',
            token: store.get('context')
          }));
        }

        for (var i = 0; i < msgs.length; i++) {
          sk.send(msgs[i]);
        }

        var set = [];

        for (var name in messageTypes) {
          if (name == '_all_') {
            continue;
          }

          var s = messageTypes[name];

          for (var type in s) {
            var entry = s[type];

            if (entry.register === false) {
              continue;
            }

            set.push({
              n: name,
              id: entry.id,
              ci: entry.customId,
              f: entry.onFilter
            });
          }
        }

        if (set.length) {
          sk.send(getAsBuffer({
            type: '+*',
            set
          }));
        }
      });

      function onClose() {
        if (ws != sk) {
          return;
        }

        ws = null;
        informStatus(false);
        goAgain();
      }

      sk.addEventListener("close", onClose);
      sk.addEventListener("error", e => {
        console.log(e);

        try {
          sk.close();
        } catch (r) {}
      });
      sk.addEventListener("message", e => {
        var r = new Reader(e.data);
        var opcode = r.readCompressed();
        var handler = _opcodes[opcode];

        if (handler) {
          if (handler.size) {
            r.readUInt32();
          }

          handler.onReceive(r);
        } else {
          r.readUInt32();
        }
      });
    }

    function send(msg) {
      start();
      msg = getAsBuffer(msg);

      if (ws.readyState == WebSocket.OPEN) {
        ws.send(msg);
      } else {
        onConnectedMessages.push(msg);
      }
    }

    var refId = 1;

    function addEventListener(type, method, id, onFilter, register) {
      if (id !== undefined && typeof id != 'number') {
        throw new Error('Old websocket event listener usage detected.');
      }

      if (!method) {
        method = type;
        type = '_all_';
      }

      if (type != '_all_') {
        start();
      }

      type = type.toLowerCase();
      var entry;

      if (messageTypes[type]) {
        entry = messageTypes[type].find(mf => mf.method == method);

        if (entry) {
          entry.id = id;
          entry.onFilter = onFilter;
        } else {
          entry = {
            method,
            id,
            customId: refId++,
            onFilter,
            register
          };
          messageTypes[type].push(entry);
        }
      } else {
        typeCount++;
        entry = {
          method,
          id,
          customId: refId++,
          onFilter,
          register
        };
        messageTypes[type] = [entry];
      }

      if (type == '_all_') {
        return;
      }

      if (register === false) {
        return;
      }

      var msg = {
        type: '+',
        n: type,
        id,
        ci: entry.customId,
        f: entry.onFilter
      };

      if (!ws) {
        connect();
      }

      if (ws && ws.readyState == WebSocket.OPEN) {
        ws.send(getAsBuffer(msg));
      }
    }

    function removeEventListener(type, method) {
      if (!method) {
        method = type;
        type = '_all_';
      }

      type = type.toLowerCase();

      if (!messageTypes[type]) {
        return;
      }

      var entry = messageTypes[type].find(mf => mf.method == method);

      if (!entry) {
        return;
      }

      messageTypes[type] = messageTypes[type].filter(a => a != entry);

      if (ws && ws.readyState == WebSocket.OPEN && !(entry.register === false)) {
        ws.send(getAsBuffer({
          type: '-',
          ci: entry.customId
        }));
      }

      if (!messageTypes[type].length) {
        typeCount--;

        if (typeCount <= 0) {
          typeCount = 0;
        }

        delete messageTypes[type];
      }
    }

    function getSocket() {
      start();
      return ws;
    }

    var _opcodes = {};

    function registerOpcode(id, onReceive, size) {
      var oc = {
        onReceive,
        size: size === undefined ? true : size,
        unregister: () => {
          delete _opcodes[id];
        }
      };
      _opcodes[id] = oc;
      return oc;
    }

    function receiveJson(json, method) {
      var message = JSON.parse(json);

      if (!message) {
        return;
      }

      if (message.host) {
        if (message.reload && global.location && global.location.reload) {
          global.location.reload(true);
        }

        return;
      }

      if (message.all) {
        tellAllHandlers(message);
      } else if (message.result && message.result.type) {
        var handlers = messageTypes[message.result.type.toLowerCase()];
        expandIncludes(message);
        message = {
          entity: message.result,
          method
        };

        if (handlers && handlers.length) {
          for (var i = 0; i < handlers.length; i++) {
            handlers[i].method(message);
          }
        }
      }

      if (opts.globalMessage) {
        var e = document.createEvent('Event');
        e.initEvent('websocketmessage', true, true);
        e.message = message;
        document.dispatchEvent(e);
      }
    }

    function syncUpdate(method, reader) {
      var size = reader.readUInt32();
      var bytesArr = reader.readBytes(size);

      if (!de8) {
        de8 = new TextDecoder("utf-8");
      }

      var json = de8.decode(bytesArr);
      receiveJson(json, method);
    }

    function close() {
      if (!ws) {
        return;
      }

      var socket = ws;
      ws = null;
      socket.close();
    }

    if (opts.addDefaults) {
      registerOpcode(21, reader => syncUpdate('create', reader), false);
      registerOpcode(22, reader => syncUpdate('update', reader), false);
      registerOpcode(23, reader => syncUpdate('delete', reader), false);
      registerOpcode(8, r => {
        var payloadSize = r.readUInt32();
        r.viaNetRoom = true;
        r.roomType = r.readCompressed();
        r.roomId = r.readCompressed();
        var opcode = r.readCompressed();
        var handler = _opcodes[opcode];

        if (handler) {
          handler.onReceive(r);
        }
      }, false);
    }

    return {
      registerOpcode,
      getSocket,
      close,
      addEventListener,
      removeEventListener,
      send,
      Writer,
      Reader,
      start,
      syncUpdate,
      receiveJson
    };
  }

  ;
  var dflt = global.wsUrl ? websocketHandler({
    reconnectOnUserChange: 1,
    addDefaults: 1,
    url: global.wsUrl,
    globalMessage: 1
  }) : {};
  dflt.create = websocketHandler;
  exports.default = dflt;
  window.addEventListener('load', () => dflt.start && dflt.start());
};__mm["UI/Functions/Validation/Required"] = function (global, exports) {
  const Text = _rq("UI/Text").default;

  exports.default = value => {
    if (!value || value.trim && value.trim() == '') {
      return {
        error: 'EMPTY',
        ui: _h(Text, null, `This field is required`)
      };
    }
  };
};__mm["UI/Link"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Link(props) {
    var attribs = omit(props, ['children', 'href', '_rte']);
    attribs.alt = attribs.alt || attribs.title;
    attribs.ref = attribs.rootRef;
    var children = props.children || props.text;
    var url = props.url || props.href;

    if (url) {
      if (url[0] == '/') {
        if (url.length > 1 && url[1] == '/') {} else {
          var prefix = window.urlPrefix || '';

          if (prefix) {
            if (prefix[0] != '/') {
              prefix = '/' + prefix;
            }

            if (prefix[prefix.length - 1] == "/") {
              url = url.substring(1);
            }

            url = prefix + url;
          }
        }
      }
    }

    return _h("a", {
      href: url,
      ...attribs
    }, children);
  }

  exports.default = Link;
  Link.editable = true;
  Link.propTypes = {
    title: 'string',
    href: 'string',
    children: 'jsx'
  };
};__mm["UI/Functions/QueryString"] = function (global, exports) {
  function queryString(fields) {
    if (!fields) {
      return '';
    }

    var qs = '';

    for (var f in fields) {
      if (qs.length) {
        qs += '&';
      }

      qs += encodeURIComponent(f) + '=' + encodeURIComponent(fields[f]);
    }

    return '?' + qs;
  }

  exports.default = queryString;
};__mm["UI/LoginForm"] = function (global, exports) {
  const Input = _rq("UI/Input").default;

  const Form = _rq("UI/Form").default;

  const Row = _rq("UI/Row").default;

  const Col = _rq("UI/Column").default;

  const Canvas = _rq("UI/Canvas").default;

  const Spacer = _rq("UI/Spacer").default;

  const Alert = _rq("UI/Alert").default;

  const {
    useSession,
    useRouter
  } = _rq("UI/Session");

  const {
    useState,
    useEffect
  } = global.React;

  const webRequest = _rq("UI/Functions/WebRequest").default;

  exports.default = props => {
    const {
      session,
      setSession
    } = useSession();
    const {
      setPage
    } = useRouter();
    const [failed, setFailed] = useState(false);
    const [moreRequired, setMoreRequired] = useState(null);
    const [emailVerificationRequired, setEmailVerificationRequired] = useState(null);
    const [emailVerificationSent, setEmailVerificationSent] = useState(null);
    const {
      emailOnly,
      passwordRequired
    } = props;
    const user = session.user;
    var validate = ['Required'];

    if (emailOnly) {
      validate.push("EmailAddress");
    }

    var validatePassword = [];

    if (passwordRequired) {
      validatePassword.push('Required');
    }

    onClickResendVerificationEmail = () => {
      webRequest('user/sendverifyemail', {
        email: user.email
      }).then(resp => {
        setEmailVerificationSent(true);
      });
    };

    useEffect(() => {
      if (user && user.Role == 3) {
        setEmailVerificationRequired(true);
      }
    });

    if (emailVerificationRequired) {
      return _h("div", {
        className: "login-form"
      }, _h("p", null, "You need to verify your email to continue. Please follow the instructions in the email, or you can resend the email by pressing the button below."), !emailVerificationSent ? _h("button", {
        className: "btn btn-primary",
        onClick: e => onClickResendVerificationEmail()
      }, "Resend email") : _h("p", null, "Email sent!"));
    }

    return _h(Form, {
      className: "login-form",
      action: "user/login",
      onSuccess: response => {
        if (response.moreDetailRequired) {
          setMoreRequired(response.moreDetailRequired);
          return;
        }

        setSession(response);

        if (response && response.role && response.role.id == 3 || response.role.key == "guest") {
          setEmailVerificationRequired(true);
        } else if (!props.noRedirect) {
          if (location.search) {
            var args = {};
            var pieces = location.search.substring(1).split('&');

            for (var i = 0; i < pieces.length; i++) {
              var queryPart = pieces[i].split('=', 2);
              args[queryPart[0]] = queryPart.length == 2 ? decodeURIComponent(queryPart[1]) : true;
            }

            if (args.then && args.then.length > 1 && args.then[0] == '/' && args.then[1] != '/') {
              setPage(args.then);
              return;
            }
          }

          setPage(props.redirectTo || '/');
        }

        props.onLogin && props.onLogin(response, setPage, setSession, props);
      },
      onValues: v => {
        setFailed(false);
        return v;
      },
      onFailed: e => setFailed(e)
    }, moreRequired && _h(Canvas, null, moreRequired), _h("div", {
      style: {
        display: moreRequired ? 'none' : 'initial'
      }
    }, _h(Input, {
      label: props.noLabels ? null : emailOnly ? `Email` : `Email or username`,
      name: "emailOrUsername",
      placeholder: emailOnly ? `Email` : `Email or username`,
      validate: validate
    }), _h(Input, {
      label: props.noLabels ? null : `Password`,
      name: "password",
      placeholder: `Password`,
      type: "password",
      validate: validatePassword
    }), _h(Row, null, !props.noRemember && _h(Col, {
      size: "6"
    }, _h(Input, {
      type: "checkbox",
      label: `Remember me`,
      name: "remember"
    })), _h(Col, {
      size: "6"
    }, !props.noForgot && _h("a", {
      href: "/forgot",
      className: "forgot-password-link"
    }, props.forgotPasswordText || `I forgot my password`)))), _h(Spacer, {
      height: "20"
    }), _h(Input, {
      type: "submit",
      label: props.loginCta || `Login`
    }), failed && _h(Alert, {
      type: "fail"
    }, failed.message || `Those login details weren't right - please try again.`), props.noRegister ? null : _h("div", {
      className: "form-group"
    }, _h("span", {
      className: "fa fa-info-circle"
    }), " ", `Don't have an account?`, " ", _h("a", {
      href: props.registerUrl || "/register"
    }, `Register here`)));
  };
};__mm["UI/Session"] = function (global, exports) {
  const {
    default: webRequest,
    expandIncludes
  } = _rq("UI/Functions/WebRequest");

  let initState = null;

  if (global.gsInit) {
    initState = global.gsInit;

    for (var k in initState) {
      initState[k] = expandIncludes(initState[k]);
    }

    initState.loadingUser = false;
  } else {
    initState = {
      loadingUser: true
    };
  }

  const Session = React.createContext();
  const Router = React.createContext();
  exports.Session = Session;
  exports.Router = Router;

  function useSession() {
    return React.useContext(Session);
  }

  exports.useSession = useSession;

  function useTheme() {
    return getCfg('globaltheme') || {};
  }

  exports.useTheme = useTheme;

  function useConfig(name) {
    return getCfg(name);
  }

  exports.useConfig = useConfig;

  function getCfg(name) {
    return global.__cfg ? global.__cfg[name.toLowerCase()] : null;
  }

  function getDeviceId() {
    var store = window.localStorage;

    if (!store) {
      return null;
    }

    var device = store.getItem("device");

    if (device != null) {
      device = JSON.parse(device);
    } else {
      device = {
        v: 1,
        id: generateId(20)
      };
      store.setItem("device", JSON.stringify(device));
    }

    return device.id;
  }

  exports.getDeviceId = getDeviceId;

  function generateId(len) {
    var arr = new Uint8Array(len / 2);
    window.crypto.getRandomValues(arr);
    return arr.map(dec => dec.toString(16).padStart(2, '0')).join('');
  }

  exports.Provider = props => {
    const [session, setSession] = React.useState(initState);

    let dispatchWithEvent = (updatedVal, diff) => {
      if (diff) {
        updatedVal = { ...session,
          ...updatedVal
        };
      }

      for (var k in updatedVal) {
        updatedVal[k] = expandIncludes(updatedVal[k]);
      }

      var e = new Event('xsession');
      e.state = updatedVal;
      e.setSession = setSession;
      document.dispatchEvent && document.dispatchEvent(e);
      return setSession(updatedVal);
    };

    if (session.loadingUser === true) {
      session.loadingUser = webRequest("user/self").then(response => {
        var state = response !== null && response !== void 0 && response.json ? { ...response.json,
          loadingUser: null
        } : {
          loadingUser: null
        };
        dispatchWithEvent(state);
        return state;
      }).catch(() => dispatchWithEvent({
        user: null,
        realUser: null,
        loadingUser: null
      }));
    }

    return _h(Session.Provider, {
      value: {
        session,
        setSession: dispatchWithEvent
      }
    }, props.children);
  };

  exports.SessionConsumer = props => _h(Session.Consumer, null, v => props.children(v.session, v.setSession));

  exports.RouterConsumer = props => _h(Router.Consumer, null, v => props.children(v.pageState, v.setPage));

  exports.ConfigConsumer = props => props.children(getCfg(props.name));

  exports.ThemeConsumer = props => props.children(getCfg('globaltheme'));

  function useRouter() {
    return React.useContext(Router);
  }

  exports.useRouter = useRouter;
  ;
};__mm["UI/Start"] = function (global, exports) {
  const App = _rq("UI/Start/App").default;

  const providers = [];

  function start(custom) {
    if (!custom) {
      for (var m in __mm) {
        var moduleValue = __mm[m] && global.require(m);

        if (moduleValue.Provider) {
          providers.push(moduleValue.Provider);
        }
      }
    }

    var root = document.getElementById('react-root');

    if (root) {
      var loader = document.getElementById('react-loading');
      loader && loader.parentNode.removeChild(loader);
      global.cIndex = 0;
      (root.childNodes.length ? React.hydrate : React.render || ReactDom.render)(_h(App, {
        providers: providers
      }), root);
      global.cIndex = undefined;
    }
  }

  exports.default = start;
  ;
};__mm["UI/Content"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  const webSocket = _rq("UI/Functions/WebSocket").default;

  const RouterConsumer = _rq("UI/Session").RouterConsumer;

  const ContentContext = React.createContext();

  class ContentIntl extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        content: props.id ? Content.getCached(props.type, props.id) : null
      };
      this.onLiveMessage = this.onLiveMessage.bind(this);
      this.onContentChange = this.onContentChange.bind(this);
    }

    evtType() {
      var content = this.state.content;

      if (!content || content._err) {
        return null;
      }

      var name = content.type;
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    onLiveMessage(msg) {
      if (msg.all) {
        if (msg.type == "status") {
          if (msg.connected) {
            var {
              type,
              id,
              includes
            } = this.props;
            this.load(type, id, includes);
          }

          this.props.onLiveStatus && this.props.onLiveStatus(msg.connected);
        }

        return;
      }

      if (this.state.content && msg.entity) {
        var e = msg.entity;
        var entityId = e.id;

        if (msg.method == 'delete') {
          this.onContentChange({
            deleted: true,
            entity: e
          });
        } else if (msg.method == 'update' || msg.method == 'create') {
          this.onContentChange({
            entity: e
          });
        }
      }
    }

    onContentChange(e) {
      var content = this.state.content;

      if (!content) {
        return;
      }

      var entity = e.entity;

      if (entity && entity.type != this.evtType()) {
        return;
      }

      if (this.props.onContentChange) {
        entity = this.props.onContentChange(entity);

        if (!entity) {
          return;
        }
      }

      if (e.deleted) {
        this.setState({
          content: {
            _err: true
          }
        });
      } else {
        if (content.id == entity.id) {
          this.setState({
            content: entity
          });
        }
      }
    }

    componentDidUpdate(prevProps) {
      var {
        type,
        id,
        includes
      } = this.props;
      this.updateWS(prevProps && id != prevProps.id);

      if (prevProps && type == prevProps.type && id == prevProps.id) {
        return;
      }

      if (type !== '' && id !== 0) {
        this.load(type, id, includes);
      }
    }

    load(type, id, includes) {
      Content.get(type, id, includes).then(content => this.setState({
        content
      })).catch(e => {
        this.setState({
          content: {
            _err: e
          }
        });
      });
    }

    componentWillUnmount() {
      if (this.mountedType) {
        webSocket.removeEventListener(this.mountedType, this.onLiveMessage);
        this.mountedType = null;
      }

      document.removeEventListener("contentchange", this.onContentChange);
    }

    updateWS(idChange) {
      var {
        live,
        id
      } = this.props;

      if (live) {
        var idealType = this.evtType();
        var typeChange = idealType && idealType != this.mountedType;
        this.mountedType = idealType !== null && idealType !== void 0 ? idealType : this.mountedType;

        if (this.mountedType && (typeChange || idChange)) {
          webSocket.addEventListener(this.mountedType, this.onLiveMessage, id);
        }
      }
    }

    componentDidMount() {
      var {
        type,
        id,
        includes
      } = this.props;
      this.updateWS();
      document.addEventListener("contentchange", this.onContentChange);

      if (!this.state.content && id) {
        this.load(type, id, includes);
      }
    }

    render() {
      var {
        content
      } = this.state;
      var {
        children
      } = this.props;
      var loading = false;

      if (!content) {
        loading = true;
      } else if (content._err) {
        content = null;
      }

      return _h(ContentContext.Provider, {
        value: {
          content
        }
      }, children ? children(content, loading) : null);
    }

  }

  function Content(props) {
    return props.primary ? _h(RouterConsumer, null, pgState => {
      if (!pgState.po) {
        return null;
      }

      if (pgState.po.type && pgState.po.id) {
        return _h(ContentIntl, {
          type: pgState.po.type,
          id: pgState.po.id,
          ...props
        });
      }

      return props.children ? props.children(pgState.po, false) : null;
    }) : _h(ContentIntl, { ...props
    });
  }

  exports.default = Content;

  function useContent() {
    return React.useContext(ContentContext);
  }

  exports.useContent = useContent;
  exports.ContentConsumer = ContentContext.Consumer;

  Content.get = function (type, id, includes) {
    var url = type + '/' + id;
    return webRequest(url, null, includes ? {
      includes
    } : null).then(response => response.json);
  };

  Content.list = function (type, filter, includes) {
    var url = type + '/list';
    return webRequest(url, filter, includes ? {
      includes
    } : null).then(response => response.json);
  };

  Content.getCached = function (type, id) {
    if (!global.pgState || global.cIndex === undefined) {
      return null;
    }

    var {
      data
    } = global.pgState;
    return data ? data[global.cIndex++] : null;
  };

  Content.listCached = function (type, filter, includes) {
    return Content.getCached();
  };
};__mm["UI/Search"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  const getRef = _rq("UI/Functions/GetRef").default;

  const Debounce = _rq("UI/Functions/Debounce").default;

  class Search extends React.Component {
    constructor(props) {
      super(props);
      this.search = this.search.bind(this);
      this.state = {
        loading: false,
        results: null,
        hidden: this.props.startHidden,
        debounce: new Debounce(this.search)
      };
    }

    componentDidMount() {
      var result = this.props.result;

      if (result) {
        this.setState({
          result
        });
      } else {
        var id = this.props.value || this.props.defaultValue;
        var url = this.props.for;

        if (!id || !url) {
          return;
        }

        if (this.props.host) {
          url = url.indexOf('http') === 0 || url[0] == '/' ? url : this.props.host + '/v1/' + url;
        }

        webRequest(url + '/' + id).then(response => {
          if (response && response.json) {
            this.setState({
              result: response.json
            });
          }
        });
      }
    }

    selectResult(result) {
      this.setState({
        results: null,
        result,
        id: result ? result.id : null
      });

      if (this.input) {
        this.input.value = '';
      }

      this.props.onFind && this.props.onFind(result);
    }

    search(query) {
      if (this.props.onSearch) {
        this.props.onSearch(query);
        return;
      }

      if (this.props.minLength && query.length < this.props.minLength) {
        var results = null;
        this.setState({
          loading: false,
          results
        });
        return;
      }

      var excludeIds = this.props.exclude ? this.props.exclude : [];
      var where = {};
      var field = this.props.field || 'name';
      var fieldNameUcFirst = field.charAt(0).toUpperCase() + field.slice(1);
      where[fieldNameUcFirst] = {
        contains: query
      };

      if (this.props.onQuery) {
        where = this.props.onQuery(where, query);
      }

      var url = this.props.for ? this.props.for + '/list' : this.props.endpoint + '?q=' + encodeURIComponent(query);

      if (this.props.host) {
        url = url.indexOf('http') === 0 || url[0] == '/' ? url : this.props.host + '/v1/' + url;
      }

      if (this.props.for) {
        this.setState({
          loading: true
        });
        webRequest(url, {
          where,
          pageSize: this.props.limit || 50
        }, this.props.requestOpts).then(response => {
          var results = response.json ? response.json.results : [];

          if (excludeIds && excludeIds.length > 0) {
            results = results.filter(t => !excludeIds.includes(t.id));
          }

          this.setState({
            loading: false,
            results
          });
        });
      } else if (this.props.endpoint) {
        webRequest(url, null, this.props.requestOpts).then(response => {
          var results = response.json ? response.json.results : [];
          this.props.onResults && this.props.onResults(results);
          this.setState({
            loading: false,
            results
          });
        });
      }
    }

    avatar(result) {
      if (result.avatarRef === undefined) {
        return '';
      }

      return getRef(result.avatarRef);
    }

    display(result, isSuggestion) {
      if (this.props.onDisplay) {
        return this.props.onDisplay(result, isSuggestion);
      }

      var field = this.props.field || 'name';
      field = field.charAt(0).toLowerCase() + field.slice(1);

      if (field == 'fullName' && result.email) {
        return result[field] + ' (' + result.email + ')';
      }

      return result[field];
    }

    render() {
      if (this.state.hidden) {
        return _h("div", {
          className: "search",
          onClick: () => {
            this.setState({
              hidden: false
            });
          }
        }, this.props.onHidden ? this.props.onHidden() : _h("i", {
          className: "fa fa-search"
        }));
      }

      return _h("div", {
        className: "search",
        "data-theme": this.props['data-theme'] || 'search-theme'
      }, _h("input", {
        ref: ele => {
          this.input = ele;
        },
        onblur: () => {
          this.setState({
            results: null
          });
        },
        autoComplete: "false",
        className: "form-control",
        defaultValue: this.props.defaultSearch,
        value: this.props.searchText,
        placeholder: this.props.placeholder || 'Search...',
        type: "text",
        onKeyUp: e => {
          if (e.keyCode != 27) {
            this.state.debounce.handle(e.target.value);
          }
        },
        onFocus: e => {
          if (e.target.value.length > 0) {
            this.state.debounce.handle(e.target.value);
          }
        },
        onKeyDown: e => {
          if (e.keyCode == 13) {
            if (this.state.results && !this.props.onResults && this.state.results.length == 1) {
              this.selectResult(this.state.results[0]);
            }

            e.preventDefault();
          }

          if (e.keyCode == 27) {
            this.setState({
              results: null
            });
          }
        }
      }), this.state.results && !this.props.onResults && _h("div", {
        className: "suggestions"
      }, this.state.results.length ? this.state.results.map((result, i) => _h("button", {
        type: "button",
        key: i,
        onMouseDown: () => this.selectResult(result),
        className: "btn suggestion"
      }, this.display(result, true))) : _h("div", {
        className: "no-results"
      }, "No results found")), this.props.name && _h("input", {
        type: "hidden",
        value: this.state.id || this.props.value || this.props.defaultValue,
        name: this.props.name
      }));
    }

  }

  exports.default = Search;
};__mm["UI/PageWithSidebar"] = function (global, exports) {
  function PageWithSidebar(props) {
    return _h("div", {
      className: "page-with-sidebar"
    }, _h("div", {
      className: "sidebar"
    }, props.sidebar), _h("div", {
      className: ""
    }, props.children));
  }

  exports.default = PageWithSidebar;
};__mm["UI/ProjectList"] = function (global, exports) {
  const storage = _rq("UI/Functions/Store").default;

  const ProjectListContext = React.createContext();
  exports.ProjectListContext = ProjectListContext;

  function useProjectList() {
    return React.useContext(ProjectListContext);
  }

  exports.useProjectList = useProjectList;

  exports.Provider = props => {
    const [projectList, setProjectList] = React.useState(() => {
      var projectSet = storage.get('projects') || [];
      return projectSet;
    });

    var addProject = project => {
      if (projectList) {
        var existing = projectList.find(proj => proj.directory == project.directory);

        if (existing) {
          return existing;
        }
      }

      var newProjectList = [...projectList, project];
      project.id = newProjectList.length;
      storage.set('projects', newProjectList);
      setProjectList(newProjectList);
      return project;
    };

    return _h(ProjectListContext.Provider, {
      value: {
        projectList,
        addProject
      }
    }, props.children);
  };

  exports.ProjectListConsumer = props => _h(ProjectListContext.Consumer, null, v => props.children(v.projectList, v.addProject));

  function ProjectList(props) {
    var {
      projectList
    } = useProjectList();
    return _h("div", {
      className: "project-list"
    }, projectList.length ? projectList.map(project => {
      return _h("a", {
        href: '/projects/' + project.id
      }, _h("div", {
        className: "project-list__project"
      }, _h("h3", null, project.name), _h("div", {
        className: "project-list__project-location"
      }, project.directory)));
    }) : `No projects added yet`);
  }

  exports.default = ProjectList;
};__mm["UI/Input"] = function (global, exports) {
  var id = 1;

  const Loop = _rq("UI/Loop").default;

  const omit = _rq("UI/Functions/Omit").default;

  const Checkbox = _rq("UI/Input/Checkbox").default;

  const Radio = _rq("UI/Input/Radio").default;

  const DefaultPasswordStrength = 5;
  var inputTypes = global.inputTypes = global.inputTypes || {};

  function padded(time) {
    if (time < 10) {
      return '0' + time;
    }

    return time;
  }

  function dateFormatStr(d) {
    return d.getFullYear() + '-' + padded(d.getMonth() + 1) + '-' + padded(d.getDate()) + 'T' + padded(d.getHours()) + ':' + padded(d.getMinutes());
  }

  class Input extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        pwVisible: false
      };
      this.newId();
      this.onInput = this.onInput.bind(this);
      this.onChange = this.onChange.bind(this);
      this.updateValidation = this.updateValidation.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.setRef = this.setRef.bind(this);
      this.onSelectChange = this.onSelectChange.bind(this);
      this.onTransparentChange = this.onTransparentChange.bind(this);
    }

    componentWillReceiveProps(props) {
      this.newId();
    }

    componentDidMount() {
      if (this.props.autoFocus && this.inputRef) {
        this.inputRef.focus();
      }
    }

    newId() {
      this.fieldId = 'form-field-' + id++;
      this.helpBeforeFieldId = this.fieldId + "-help-before";
      this.helpAfterFieldId = this.fieldId + "-help-after";
      this.helpIconFieldId = this.fieldId + "-help-icon";
      this.describedById = this.helpBeforeFieldId || this.helpAfterFieldId || this.helpIconFieldId;
    }

    renderLabel() {
      if (!this.props.label || this.props.type == "submit" || this.props.type == "checkbox" || this.props.type == "radio" || this.props.type == "toggle") {
        return null;
      }

      return _h("label", {
        htmlFor: this.props.id || this.fieldId,
        className: "form-label"
      }, this.props.label, !this.props.hideRequiredStar && this.props.validate && this.props.validate.indexOf("Required") != -1 && _h("span", {
        className: "is-required-field"
      }));
    }

    renderField() {
      var {
        help,
        labelPosition
      } = this.props;
      var helpPosition = 'above';

      if (help) {
        if (global.invertHelpPosition) {
          helpPosition = 'below';
        }

        if (this.props.helpPosition) {
          helpPosition = this.props.helpPosition;
        }
      }

      return _h(React.Fragment, null, labelPosition != 'float' && this.renderLabel(), help && (helpPosition == 'above' || helpPosition == 'top') && _h("div", {
        id: this.helpBeforeFieldId,
        className: "form-text form-text-above"
      }, help), this.state.validationFailure && this.props.validateErrorLocation && this.props.validateErrorLocation == "above" && _h("div", {
        className: "validation-error"
      }, this.props.validationFailure ? this.props.validationFailure(this.state.validationFailure) : this.state.validationFailure.ui), help && helpPosition == 'icon' && _h("div", {
        className: "form-control-icon-wrapper"
      }, this.renderInput(), _h("span", {
        id: this.helpIconFieldId,
        className: "fa fa-fw fa-info-circle",
        title: help
      })), helpPosition != 'icon' && this.renderInput(), labelPosition == 'float' && this.renderLabel(), help && (helpPosition == 'below' || helpPosition == 'bottom') && _h("div", {
        id: this.helpAfterFieldId,
        className: "form-text"
      }, help), this.state.validationFailure && (!this.props.validateErrorLocation || this.props.validateErrorLocation && this.props.validateErrorLocation != "above") && _h("div", {
        className: "validation-error"
      }, this.props.validationFailure ? this.props.validationFailure(this.state.validationFailure) : this.state.validationFailure.ui));
    }

    render() {
      if (this.props.inline) {
        return this.renderInput();
      }

      if (this.props.noWrapper) {
        return this.renderField();
      }

      var groupClass = this.props.groupClassName ? "mb-3 " + this.props.groupClassName : "mb-3";

      if (this.props.labelPosition == 'float') {
        groupClass = 'form-floating ' + groupClass;
      }

      return _h("div", {
        className: groupClass
      }, this.renderField());
    }

    onInput(e) {
      this.props.onInput && this.props.onInput(e);

      if (e.defaultPrevented) {
        return;
      }

      this.revalidate(e);
    }

    onChange(e) {
      this.props.onChange && this.props.onChange(e);

      if (e.defaultPrevented) {
        return;
      }

      this.revalidate(e);
    }

    onBlur(e) {
      this.props.onBlur && this.props.onBlur(e);

      if (e.defaultPrevented) {
        return;
      }

      this.revalidate(e);
    }

    onSelectChange(e) {
      this.setState({
        selectValue: e.target.value
      });
      this.props.onChange && this.props.onChange(e);

      if (e.defaultPrevented) {
        return;
      }

      this.revalidate(e);
    }

    onTransparentChange(e) {
      if (this.props.type == "color" && this.inputRef && e && e.target) {
        if (e.target.checked) {
          if (this.inputRef.value && this.inputRef.value.length == 7) {
            this.inputRef.type = "text";
            this.inputRef.value += "00";
            this.inputRef.style.display = "none";
          }
        } else {
          if (this.inputRef.value && this.inputRef.value.length == 9) {
            this.inputRef.value = this.inputRef.value.slice(0, -2);
            this.inputRef.type = "color";
            this.inputRef.style.display = "block";
          }
        }
      }
    }

    validationError() {
      var validations = this.props.validate;

      if (!validations) {
        return false;
      }

      if (!Array.isArray(validations)) {
        validations = [validations];
      }

      var field = this.inputRef;

      if (!field) {
        return false;
      }

      var v = field.type == 'checkbox' ? field.checked : field.value;
      var vFail = null;

      if (field.type === 'password') {
        this.setState({
          strength: this.passwordStrength(this.inputRef.value)
        });
      }

      for (var i = 0; i < validations.length; i++) {
        var valType = validations[i];

        if (!valType) {
          continue;
        }

        switch (typeof valType) {
          case "string":
            var mtd = require("UI/Functions/Validation/" + valType).default;

            vFail = mtd(v);
            break;

          case "function":
            vFail = valType(v);
            break;

          default:
            console.log("Invalid validation type: ", validations, valType, i);
            break;
        }

        if (vFail) {
          return vFail;
        }
      }

      return false;
    }

    revalidate(e) {
      this.updateValidation(e.target);
    }

    updateValidation(el) {
      if (el != this.inputRef) {
        return false;
      }

      var invalid = this.validationError();

      if (this.state.validationFailure != invalid) {
        this.setState({
          validationFailure: invalid
        });
      }

      return !!invalid;
    }

    passwordStrength(pw) {
      var reUpperCase = /[A-Z]+/;
      var reLowerCase = /[a-z]+/;
      var reNum = /[0-9]+/;
      var reUnique = /[^A-Za-z0-9]+/;
      var rePass = /[Pp][Aa4][Ss5$]{2}[Ww][Oo0][Rr][Dd]/;
      var reAlphaSeq = /abcdef?g?h?i?j?k?l?m?n?o?p?q?r?s?t?u?v?w?x?y?z?/;
      var reKbWalk1 = /[1!][2"][3£][4$][5%][6^]?[7&]?[8*]?[9(]?[0)]?[-_]?[=+]?/;
      var reKbWalk2 = /[Qq][Ww][Ee][Rr][Tt][Yy]?[Uu]?[Ii]?[Oo]?[Pp]?[[{]?[\]}]?/;
      var reKbWalk3 = /asdfgh?j?k?l?;?'?#?/;
      var reKbWalk4 = /zxcvbn?m?,?\.?\/?/;
      var reward = 0;
      reward += reUpperCase.test(pw) ? 3 : 0;
      reward += reLowerCase.test(pw) ? 3 : 0;
      reward += reNum.test(pw) ? 3 : 0;
      reward += reUnique.test(pw) ? 3 : 0;
      var penalty = 0;
      penalty += rePass.test(pw) ? 30 : 0;
      penalty += reAlphaSeq.test(pw) ? 20 : 0;
      penalty += reKbWalk1.test(pw) ? 20 : 0;
      penalty += reKbWalk2.test(pw) ? 20 : 0;
      penalty += reKbWalk3.test(pw) ? 20 : 0;
      penalty += reKbWalk4.test(pw) ? 20 : 0;
      var symbolPool = 0;
      symbolPool += reUpperCase.test(pw) ? 26 : 0;
      symbolPool += reLowerCase.test(pw) ? 26 : 0;
      symbolPool += reNum.test(pw) ? 10 : 0;
      symbolPool += reUnique.test(pw) ? 33 : 0;
      var uniqueChars = [];

      for (let char of pw) {
        if (!uniqueChars.includes(char)) {
          uniqueChars.push(char);
        }
      }

      var uniqueCharCount = uniqueChars.length;
      reward += uniqueCharCount / 4;
      var possibleCombos = Math.pow(symbolPool, pw.length);
      var entropy = Math.log2(possibleCombos);
      var strength = (entropy + reward - penalty) / 1.5;
      return strength;
    }

    pwStrengthClass(strength) {
      if (strength >= 55) {
        return 'strong';
      } else if (strength >= 45) {
        return 'medium';
      } else {
        return 'weak';
      }
    }

    setRef(ref) {
      this.inputRef = ref;
      this.props.inputRef && this.props.inputRef(ref);

      if (ref) {
        ref.onValidationCheck = this.updateValidation;
      }
    }

    renderInput() {
      const {
        type,
        contentType
      } = this.props;

      if (type instanceof Function) {
        return type(this);
      }

      if (contentType) {
        var handler = inputTypes[contentType];

        if (handler != null) {
          return handler({ ...this.props,
            onChange: this.onChange,
            onBlur: this.onBlur
          }, type, this);
        }
      }

      var disabledBy = this.props.disabledBy;
      var enabledBy = this.props.enabledBy;
      var fieldName = this.props.fieldName;

      if (type === "select") {
        var {
          noSelectionValue
        } = this.props;
        var defaultValue = typeof this.state.selectValue === 'undefined' ? this.props.defaultValue : this.state.selectValue;
        var noSelection = this.props.noSelection || "None Specified";
        var mobileNoSelection = this.props.mobileNoSelection || "None Specified";

        if (noSelectionValue === undefined) {
          noSelectionValue = '';
        }

        if (window.matchMedia('(max-width: 752px) and (pointer: coarse) and (orientation: portrait)').matches || window.matchMedia('(max-height: 752px) and (pointer: coarse) and (orientation: landscape)').matches) {
          noSelection = mobileNoSelection;
        }

        var selectClass = this.props.className || "form-select" + (this.state.validationFailure ? ' is-invalid' : '');

        if (defaultValue == undefined) {
          selectClass += " no-selection";
        }

        return _h("select", {
          ref: this.setRef,
          onChange: this.onSelectChange,
          onBlur: this.onBlur,
          autocomplete: this.props.autocomplete,
          value: defaultValue,
          id: this.props.id || this.fieldId,
          className: selectClass,
          ...omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'children', 'defaultValue', 'value', 'inline', 'help', 'helpIcon', 'fieldName']),
          "data-field": fieldName
        }, this.props.contentType ? [_h("option", {
          value: noSelectionValue
        }, noSelection), _h(Loop, {
          over: this.props.contentType + '/list',
          raw: true,
          filter: this.props.filter
        }, entry => _h("option", {
          value: entry.id,
          selected: entry.id == defaultValue ? true : undefined
        }, entry[this.props.displayField || 'name']))] : this.props.children);
      } else if (type === "textarea") {
        return _h(React.Fragment, null, _h("textarea", {
          ref: this.setRef,
          onChange: this.onChange,
          onBlur: this.onBlur,
          autocomplete: this.props.autocomplete,
          id: this.props.id || this.fieldId,
          className: (this.props.className || "form-control") + (this.state.validationFailure ? ' is-invalid' : ''),
          ...omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'inline', 'help', 'helpIcon', 'fieldName']),
          oninput: e => {
            this.setState({
              textAreaLength: e.target.textLength
            });
          }
        }), this.props.maxlength && this.props.showLength && _h("div", {
          className: "textarea-char-count"
        }, (this.state.textAreaLength ? this.state.textAreaLength : this.props.defaultValue ? this.props.defaultValue.length : 0) + "/" + this.props.maxlength));
      } else if (type === "submit" || type === "button") {
        var showIcon = this.props.icon;
        return _h("button", {
          className: this.props.className || "btn btn-primary",
          type: type,
          ...omit(this.props, ['className', 'type', 'label', 'children', 'inline', 'help', 'helpIcon', 'fieldName'])
        }, !!showIcon && _h("i", {
          className: this.props.icon
        }), this.props.label || this.props.children || "Submit");
      } else if (type === "checkbox" || type == "bool" || type == "boolean") {
        return _h(Checkbox, {
          ref: this.setRef,
          id: this.props.id || this.fieldId,
          className: this.props.className,
          label: this.props.label,
          "aria-describedby": this.describedById,
          onChange: this.onChange,
          onBlur: this.onBlur,
          "data-field": fieldName,
          invalid: this.state.validationFailure ? true : undefined,
          ...omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'inline', 'value', 'defaultValue', 'help', 'helpIcon', 'fieldName']),
          checked: this.props.value,
          defaultValue: this.props.defaultValue,
          isSwitch: false
        });
      } else if (type === "radio") {
        return _h(Radio, {
          ref: this.setRef,
          id: this.props.id || this.fieldId,
          className: this.props.className,
          name: this.props.name,
          label: this.props.label,
          "aria-describedby": this.describedById,
          onChange: this.onChange,
          onBlur: this.onBlur,
          "data-field": fieldName,
          invalid: this.state.validationFailure ? true : undefined,
          ...omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'inline', 'defaultValue', 'help', 'helpIcon', 'fieldName']),
          checked: this.props.defaultValue == this.props.value,
          disabled: false
        });
      } else if (type === "password") {
        var {
          pwVisible
        } = this.state;

        if (this.props.visible !== undefined) {
          pwVisible = this.props.visible;
        }

        if (this.props.showMeter) {
          var strengthClass = 'none';
          var strength = DefaultPasswordStrength;

          if (this.state.strength) {
            strength = this.state.strength;
            strengthClass = this.pwStrengthClass(strength);
          }
        }

        return _h(React.Fragment, null, _h("div", {
          className: "input-group"
        }, _h("input", {
          ref: this.setRef,
          id: this.props.id || this.fieldId,
          className: (this.props.className || "form-control") + (this.state.validationFailure ? ' is-invalid' : ''),
          "aria-describedby": this.describedById,
          type: pwVisible ? 'text' : type,
          autocomplete: this.props.autocomplete,
          onChange: this.onChange,
          onBlur: this.onBlur,
          onInput: this.onInput,
          ...omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'inline', 'help', 'helpIcon', 'fieldName'])
        }), !this.props.noVisiblityButton && !this.props.noVisibilityButton && _h("span", {
          className: "input-group-text clickable",
          onClick: () => {
            this.setState({
              pwVisible: !pwVisible
            });
          }
        }, _h("i", {
          className: "fa fa-fw fa-eye" + (pwVisible ? '-slash' : '')
        }))), this.props.showMeter && _h("meter", {
          className: "meter password-meter",
          min: "0",
          max: "100",
          value: strength,
          low: "44",
          high: "55",
          optimum: "80"
        }));
      } else {
        var handler = inputTypes['ontype' + type];

        if (handler) {
          return handler({ ...this.props,
            onChange: this.onChange,
            onBlur: this.onBlur
          }, type, this);
        }

        var props = omit(this.props, ['id', 'className', 'onChange', 'onBlur', 'type', 'inline', 'help', 'helpIcon', 'fieldName']);

        if (type == 'datetime-local') {
          if (props.defaultValue && props.defaultValue.getTime) {
            var d = props.defaultValue;
            props.defaultValue = dateFormatStr(props.defaultValue);
          }

          if (props.value && props.value.getTime) {
            var d = props.value;
            props.value = dateFormatStr(props.value);
          }

          if (props.min && props.min.getTime) {
            var d = props.min;
            props.min = dateFormatStr(props.min);
          }

          if (props.max && props.max.getTime) {
            var d = props.max;
            props.max = dateFormatStr(props.max);
          }

          props.ref = r => {
            this.setRef(r);

            if (r) {
              r.onGetValue = (v, r) => {
                if (this.inputRef == r && v) {
                  return new Date(Date.parse(v));
                }

                return v;
              };
            }
          };
        }

        var fieldMarkup = _h("input", {
          ref: this.setRef,
          id: this.props.id || this.fieldId,
          className: (this.props.className || "form-control") + (this.state.validationFailure ? ' is-invalid' : ''),
          "aria-describedby": this.describedById,
          type: type,
          onChange: this.onChange,
          onBlur: this.onBlur,
          onInput: this.onInput,
          autocomplete: this.props.autocomplete,
          "data-disabled-by": disabledBy,
          "data-enabled-by": enabledBy,
          ...props
        });

        if (this.props.type == 'color') {
          const colorValue = this.inputRef && this.inputRef.value ? this.inputRef.value : this.props.defaultValue;
          const isTransparent = colorValue && colorValue.length == 9;

          if (isTransparent) {
            fieldMarkup = _h("input", {
              ref: this.setRef,
              id: this.props.id || this.fieldId,
              className: (this.props.className || "form-control") + (this.state.validationFailure ? ' is-invalid' : ''),
              "aria-describedby": this.describedById,
              type: "text",
              onChange: this.onChange,
              onBlur: this.onBlur,
              onInput: this.onInput,
              autocomplete: this.props.autocomplete,
              "data-disabled-by": disabledBy,
              "data-enabled-by": enabledBy,
              style: {
                display: "none"
              },
              ...props
            });
          }

          return _h("div", {
            className: "input-wrapper color-input"
          }, fieldMarkup, (this.props.allowTransparency || isTransparent) && _h(React.Fragment, null, _h("label", {
            className: "transparent-label"
          }, "Transparent"), _h("input", {
            type: "checkbox",
            name: "isTransparent",
            checked: isTransparent,
            onChange: this.onTransparentChange
          })), this.props.icon && _h("i", {
            className: this.props.icon
          }));
        }

        if (this.props.icon) {
          return _h("div", {
            className: "input-wrapper"
          }, fieldMarkup, _h("i", {
            className: this.props.icon
          }));
        }

        if (this.props.type == 'datetime-local' && this.props.roundMinutes && this.props.roundMinutes > 0) {
          fieldMarkup.props.onChange = e => {
            var [hours, minutes] = e.target.value.slice(-4).split(':');
            hours = parseInt(hours);
            minutes = parseInt(minutes);
            var time = hours * 60 + minutes;
            var rounded = Math.round(time / this.props.roundMinutes) * this.props.roundMinutes;
            e.target.value = e.target.value.slice(0, -4) + Math.floor(rounded / 60) + ':' + String(rounded % 60).padStart(2, '0');
            this.onChange(e);
          };
        }

        return fieldMarkup;
      }
    }

  }

  exports.default = Input;
  Input.propTypes = {
    type: 'string',
    name: 'string',
    help: 'string',
    placeholder: 'string',
    label: 'string',
    value: 'string'
  };
  Input.icon = 'pen-nib';
};__mm["UI/Functions/FlexGap"] = function (global, exports) {
  function checkFlexGap() {
    var flex = document.createElement("div");
    flex.style.display = "flex";
    flex.style.flexDirection = "column";
    flex.style.rowGap = "1px";
    flex.appendChild(document.createElement("div"));
    flex.appendChild(document.createElement("div"));
    document.body.appendChild(flex);
    var isSupported = flex.scrollHeight === 1;
    flex.parentNode.removeChild(flex);
    return isSupported;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var flexGapSupported = checkFlexGap();
    var html = document.querySelector("html");

    if (html) {
      if (flexGapSupported) {
        html.classList.remove("no-flexgap");
      } else {
        html.classList.add("no-flexgap");
      }
    }
  });
};__mm["UI/Form"] = function (global, exports) {
  const submitForm = _rq("UI/Functions/SubmitForm").default;

  const omit = _rq("UI/Functions/Omit").default;

  const Spacer = _rq("UI/Spacer").default;

  const Alert = _rq("UI/Alert").default;

  const Loading = _rq("UI/Loading").default;

  const Input = _rq("UI/Input").default;

  class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(props) {
      if (this.props.action != props.action) {
        this.setState({
          failure: false,
          success: false,
          loading: false
        });
      }
    }

    onSubmit(e) {
      if (!e) {
        e = {
          target: this.formEle,
          preventDefault: () => {}
        };
      }

      var {
        locale,
        onValues,
        onSuccess,
        onFailed,
        requestOpts,
        action
      } = this.props;

      if (!requestOpts) {
        requestOpts = {};
      }

      if (locale) {
        requestOpts.locale = locale;
      }

      return submitForm(e, {
        onValues: (values, evt) => {
          if (!action) {
            values.setAction(null);
          }

          this.setState({
            loading: true
          });
          return onValues ? onValues(values, evt) : values;
        },
        onFailed: (r, v, evt) => {
          this.setState({
            loading: undefined,
            failed: true,
            failure: r
          }, () => {
            onFailed && onFailed(r, v, evt);
          });
        },
        onSuccess: (r, v, evt) => {
          if (this.props.resetOnSubmit) {
            this.formEle.reset();
          }

          this.setState({
            loading: undefined,
            failed: false,
            success: true
          }, () => {
            onSuccess && onSuccess(r, v, evt);
          });
        },
        requestOpts
      });
    }

    render() {
      var {
        action,
        loadingMessage,
        submitLabel,
        submitEnabled,
        failedMessage,
        successMessage
      } = this.props;
      var showFormResponse = !!(loadingMessage || submitLabel || failedMessage);
      var submitDisabled = this.state.loading || submitEnabled !== undefined && submitEnabled != true;
      var apiUrl = global.apiHost || '';

      if (!apiUrl.endsWith('/')) {
        apiUrl += '/';
      }

      apiUrl += 'v1/';

      if (action) {
        action = action.indexOf('http') === 0 || action[0] == '/' ? action : apiUrl + action;
      }

      return _h("form", {
        onSubmit: this.onSubmit,
        ref: f => {
          this.formEle = f;

          if (f) {
            f.submit = this.onSubmit;
          }

          this.props.formRef && this.props.formRef(f);
        },
        action: action,
        method: this.props.method || "post",
        ...omit(this.props, ['action', 'method', 'onSuccess', 'onFailed', 'onValues', 'children', 'locale', 'requestOpts'])
      }, this.props.children, showFormResponse && _h("div", {
        className: "form-response"
      }, _h(Spacer, null), this.state.failed && failedMessage && _h("div", {
        className: "form-failed"
      }, _h(Alert, {
        type: "error"
      }, typeof failedMessage == "function" ? failedMessage(this.state.failure) : this.state.failure && this.state.failure.message || failedMessage), _h(Spacer, null)), this.state.success && successMessage && _h("div", {
        className: "form-success"
      }, _h(Alert, {
        type: "success"
      }, typeof successMessage == "function" ? successMessage() : successMessage), _h(Spacer, null)), submitLabel && _h(Input, {
        type: "submit",
        label: submitLabel,
        disabled: submitDisabled
      }), this.state.loading && loadingMessage && _h("div", {
        className: "form-loading"
      }, _h(Spacer, null), _h(Loading, {
        message: loadingMessage
      }))));
    }

  }

  exports.default = Form;
  Form.propTypes = {
    action: 'string'
  };
  Form.icon = 'question';
};__mm["UI/FileSelector"] = function (global, exports) {
  const Loop = _rq("UI/Loop").default;

  const Modal = _rq("UI/Modal").default;

  const Uploader = _rq("UI/Uploader").default;

  const omit = _rq("UI/Functions/Omit").default;

  const getRef = _rq("UI/Functions/GetRef").default;

  const IconSelector = _rq("UI/FileSelector/IconSelector").default;

  const Dropdown = _rq("UI/Dropdown").default;

  const Col = _rq("UI/Column").default;

  const Input = _rq("UI/Input").default;

  const Debounce = _rq("UI/Functions/Debounce").default;

  var inputTypes = global.inputTypes = global.inputTypes || {};
  let lastId = 0;

  inputTypes.ontypefile = inputTypes.ontypeimage = function (props, _this) {
    return _h(FileSelector, {
      id: props.id || _this.fieldId,
      className: props.className || "form-control",
      ...omit(props, ['id', 'className', 'type', 'inline'])
    });
  };

  inputTypes.ontypeicon = function (props, _this) {
    return _h(FileSelector, {
      id: props.id || _this.fieldId,
      iconOnly: true,
      className: props.className || "form-control",
      ...omit(props, ['id', 'className', 'type', 'inline'])
    });
  };

  inputTypes.ontypeupload = function (props, _this) {
    return _h(FileSelector, {
      id: props.id || _this.fieldId,
      browseOnly: true,
      className: props.className || "form-control",
      ...omit(props, ['id', 'className', 'type', 'inline'])
    });
  };

  class FileSelector extends React.Component {
    constructor(props) {
      super(props);
      this.search = this.search.bind(this);
      this.state = {
        ref: props.value || props.defaultValue,
        debounce: new Debounce(this.search)
      };
      this.closeModal = this.closeModal.bind(this);
    }

    newId() {
      lastId++;
      return `fileselector${lastId}`;
    }

    updateValue(e, newRef) {
      if (e) {
        e.preventDefault();
      }

      var originalName = newRef ? newRef.originalName : '';

      if (!newRef) {
        newRef = '';
      }

      if (newRef.result && newRef.result.ref) {
        newRef = newRef.result.ref;
      } else if (newRef.ref) {
        newRef = newRef.ref;
      }

      this.props.onChange && this.props.onChange({
        target: {
          value: newRef
        }
      });
      this.setState({
        value: newRef,
        originalName: originalName,
        modalOpen: false
      });
    }

    showModal() {
      this.setState({
        modalOpen: true
      });
    }

    closeModal() {
      this.setState({
        modalOpen: false
      });
    }

    search(query) {
      console.log(query);
      this.setState({
        searchFilter: query.toLowerCase()
      });
    }

    renderHeader() {
      return _h("div", {
        className: "row header-container"
      }, _h(Col, {
        size: 4
      }, _h("label", {
        htmlFor: "file-search"
      }, `Search`), _h(Input, {
        type: "text",
        value: this.state.searchFilter,
        name: "file-search",
        onKeyUp: e => {
          this.state.debounce.handle(e.target.value);
        }
      })));
    }

    render() {
      var {
        searchFilter
      } = this.state;
      var currentRef = this.props.value || this.props.defaultValue;

      if (this.state.value !== undefined) {
        currentRef = this.state.value;
      }

      var hasRef = currentRef && currentRef.length;
      var filename = hasRef ? getRef.parse(currentRef).ref : "";
      var originalName = this.state.originalName && this.state.originalName.length ? this.state.originalName : '';

      if (originalName) {
        filename = originalName;
      }

      var source = "upload/list";

      if (this.props.showActive) {
        source = "upload/active";
      }

      return _h("div", {
        className: "file-selector"
      }, _h(Modal, {
        isExtraLarge: true,
        title: `Select an Upload`,
        className: "image-select-modal",
        buttons: [{
          label: `Close`,
          onClick: this.closeModal
        }],
        onClose: this.closeModal,
        visible: this.state.modalOpen
      }, this.renderHeader(), _h("div", {
        className: "file-selector__grid"
      }, _h(Loop, {
        raw: true,
        over: source,
        filter: {
          sort: {
            field: 'CreatedUtc',
            direction: 'desc'
          }
        },
        paged: true
      }, entry => {
        if (entry.originalName.toLowerCase().includes(searchFilter) || entry.originalName.toLowerCase().replace(/-/g, " ").includes(searchFilter) || !searchFilter) {
          var isImage = getRef.isImage(entry.ref);
          var renderedSize = 256;
          var imageWidth = parseInt(entry.width, 10);
          var imageHeight = parseInt(entry.height, 10);
          var previewClass = "file-selector__preview ";

          if (!isNaN(imageWidth) && !isNaN(imageHeight) && imageWidth < renderedSize && imageHeight < renderedSize) {
            renderedSize = undefined;
            previewClass += "file-selector__preview--auto";
          }

          return _h(React.Fragment, null, _h("div", {
            class: "loop-item"
          }, _h("button", {
            title: entry.originalName,
            type: "button",
            className: "btn file-selector__item",
            onClick: e => this.updateValue(e, entry)
          }, _h("div", {
            className: previewClass
          }, isImage && getRef(entry.ref, {
            size: renderedSize
          }), !isImage && _h("i", {
            className: "fal fa-4x fa-file"
          })), _h("span", {
            className: "file-selector__name"
          }, entry.originalName))));
        }
      }))), _h(IconSelector, {
        visible: this.state.iconModalOpen,
        onClose: () => {
          this.setState({
            iconModalOpen: false
          });
        },
        onSelected: icon => {
          console.log("onSelected");
          console.log(icon);
          this.updateValue(null, icon);
        }
      }), _h(Uploader, {
        currentRef: currentRef,
        originalName: originalName,
        id: this.props.id || this.newId(),
        isPrivate: this.props.isPrivate,
        url: this.props.url,
        requestOpts: this.props.requestOpts,
        maxSize: this.props.maxSize,
        onUploaded: file => this.updateValue(null, file)
      }), _h("div", {
        className: "file-selector__options"
      }, !this.props.browseOnly && _h(React.Fragment, null, this.props.uploadOnly && _h("button", {
        type: "button",
        className: "btn btn-primary file-selector__select",
        onClick: () => this.showModal()
      }, `Select upload`), this.props.iconOnly && _h("button", {
        type: "button",
        className: "btn btn-primary file-selector__select",
        onClick: () => this.setState({
          iconModalOpen: true
        })
      }, `Select icon`), !this.props.uploadOnly && !this.props.iconOnly && _h(Dropdown, {
        label: `Select`,
        variant: "primary",
        className: "file-selector__select"
      }, _h("li", null, _h("button", {
        type: "button",
        className: "btn dropdown-item",
        onClick: () => this.showModal()
      }, `From uploads`)), _h("li", null, _h("button", {
        type: "button",
        className: "btn dropdown-item",
        onClick: () => this.setState({
          iconModalOpen: true
        })
      }, `From icons`)))), hasRef && _h(React.Fragment, null, !getRef.isIcon(currentRef) && _h(React.Fragment, null, _h("a", {
        href: getRef(currentRef, {
          url: true
        }),
        alt: filename,
        className: "btn btn-primary file-selector__link",
        target: "_blank",
        rel: "noopener noreferrer"
      }, `Preview`)), _h("button", {
        type: "button",
        className: "btn btn-danger file-selector__remove",
        onClick: () => this.updateValue(null, null)
      }, `Remove`))), this.props.name && _h("input", {
        type: "hidden",
        value: currentRef,
        name: this.props.name,
        id: this.props.id
      }));
    }

  }

  exports.default = FileSelector;
};__mm["UI/Transaction/List"] = function (global, exports) {
  function List(props) {
    var setFieldsDefinition = {
      Id: 7,
      Name: 'Blockchain.SetFields'
    };
    var entityIdField = {
      Id: 16,
      Name: 'EntityId',
      DataType: 'uint'
    };
    var definitionIdField = {
      Id: 17,
      Name: 'DefinitionId',
      DataType: 'uint'
    };
    var usernameField = {
      Id: 24,
      Name: 'Username',
      DataType: 'string'
    };
    var userDefinition = {
      Id: 12,
      Name: 'User'
    };
    var definitions = [setFieldsDefinition, userDefinition];
    var fieldDefinitions = [entityIdField, definitionIdField, usernameField];
    var schema = {
      Fields: fieldDefinitions,
      Definitions: definitions
    };
    var transactions = [{
      Definition: userDefinition,
      TransactionId: 104,
      Header: [],
      Fields: [{
        Field: usernameField,
        Value: 'HistoricSteve'
      }]
    }, {
      Definition: setFieldsDefinition,
      Timestamp: 81737437837845,
      TransactionId: 180,
      Header: [{
        Field: definitionIdField,
        Value: 12
      }, {
        Field: entityIdField,
        Value: 104
      }],
      Fields: [{
        Field: usernameField,
        Value: 'Steve'
      }]
    }];
    return _h("div", {
      className: "transaction-list"
    }, transactions.map(txn => {
      return _h("div", {
        className: "transaction-list__transaction"
      }, txn.TransactionId);
    }));
  }

  exports.default = List;
};__mm["UI/Uploader"] = function (global, exports) {
  const getRef = _rq("UI/Functions/GetRef").default;

  var DEFAULT_ERROR = `Unable to upload`;
  var DEFAULT_MESSAGE = `Drag and drop your file or click to upload here`;
  const XHR_UNSENT = 0;
  const XHR_OPENED = 1;
  const XHR_HEADERS_RECEIVED = 2;
  const XHR_LOADING = 3;
  const XHR_DONE = 4;

  class Uploader extends React.Component {
    constructor(props) {
      super(props);
      var message = this.props.label || DEFAULT_MESSAGE;
      this.inputRef = React.createRef();
      this.state = {
        loading: false,
        progressPercent: 0,
        progress: "",
        message: message,
        tooltip: message,
        maxSize: this.props.maxSize || 0,
        ref: this.props.currentRef,
        aspect169: this.props.aspect169,
        aspect43: this.props.aspect43,
        filename: this.props.currentRef ? getRef.parse(this.props.currentRef).ref : undefined,
        draggedOver: false
      };
      this.handleDragEnter = this.handleDragEnter.bind(this);
      this.handleDragLeave = this.handleDragLeave.bind(this);
    }

    onSelectedFile(e) {
      var file = e.target.files[0];
      this.setState({
        loading: true,
        failed: false,
        success: false,
        progressPercent: 0,
        progress: "",
        filename: file.name,
        ref: undefined
      });
      var maxSize = this.state.maxSize;

      if (maxSize > 0 && file.size > maxSize) {
        this.setState({
          loading: false,
          success: false,
          failed: 'File too large'
        });
        return;
      }

      this.props.onStarted && this.props.onStarted(file, file);
      var xhr = new global.XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState == XHR_DONE) {
          var uploadInfo;

          try {
            uploadInfo = JSON.parse(xhr.responseText);
          } catch (e) {}

          if (!uploadInfo || xhr.status > 300) {
            this.setState({
              loading: false,
              success: false,
              failed: uploadInfo && uploadInfo.message ? uploadInfo.message : DEFAULT_ERROR
            });
            return;
          }

          this.props.onUploaded && this.props.onUploaded(uploadInfo);
          this.setState({
            loading: false,
            success: true,
            failed: false,
            ref: uploadInfo.result.ref
          });
        } else if (xhr.readyState == XHR_HEADERS_RECEIVED) {
          if (xhr.status > 300) {
            this.setState({
              loading: false,
              success: false,
              failed: DEFAULT_ERROR
            });
          }
        }
      };

      xhr.onerror = e => {
        console.log("XHR onerror", e);
        this.setState({
          loading: false,
          success: false,
          failed: DEFAULT_ERROR
        });
      };

      xhr.upload.onprogress = evt => {
        var pc = Math.floor(evt.loaded * 100 / evt.total);
        this.setState({
          progressPercent: pc,
          progress: ' ' + pc + '%'
        });
        this.props.onUploadProgress && this.props.onUploadProgress();
      };

      var ep = this.props.endpoint || "upload/create";
      var apiUrl = this.props.url || global.ingestUrl || global.apiHost || '';

      if (!apiUrl.endsWith('/')) {
        apiUrl += '/';
      }

      apiUrl += 'v1/';
      ep = ep.indexOf('http') === 0 || ep[0] == '/' ? ep : apiUrl + ep;
      xhr.open('PUT', ep, true);
      var {
        requestOpts
      } = this.props;

      if (requestOpts && requestOpts.headers) {
        for (var header in requestOpts.headers) {
          xhr.setRequestHeader(header, requestOpts.headers[header]);
        }
      }

      xhr.setRequestHeader("Content-Name", file.name);
      xhr.setRequestHeader("Private-Upload", this.props.isPrivate ? '1' : '0');
      xhr.send(file);
    }

    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) {
        return "";
      }

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    handleDragEnter() {
      this.setState({
        draggedOver: true
      });
    }

    handleDragLeave() {
      this.setState({
        draggedOver: false
      });
    }

    componentDidMount() {
      if (this.inputRef && this.inputRef.current) {
        var input = this.inputRef.current;
        input.addEventListener('dragenter', this.handleDragEnter);
        input.addEventListener('dragleave', this.handleDragLeave);
        input.addEventListener('drop', this.handleDragLeave);
      }
    }

    componentWillUnmount() {
      if (this.inputRef && this.inputRef.current) {
        var input = this.inputRef.current;
        input.removeEventListener('dragenter', this.handleDragEnter);
        input.removeEventListener('dragleave', this.handleDragLeave);
        input.removeEventListener('drop', this.handleDragLeave);
      }
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        ref: nextProps.currentRef,
        originalName: nextProps.originalName
      });
    }

    render() {
      const {
        loading,
        failed,
        progressPercent,
        progress,
        message,
        maxSize,
        ref,
        aspect169,
        aspect43,
        filename,
        draggedOver,
        tooltip,
        originalName
      } = this.state;
      var hasRef = ref && ref.length;
      var hasMaxSize = maxSize > 0;
      var hasFilename = filename && filename.length;
      var hasOriginalName = originalName && originalName.length;
      var label = loading ? `Uploading` + " " + progress + " ..." : message;
      var canShowImage = getRef.isImage(ref);
      var canShowVideo = getRef.isVideo(ref, false);
      var canShowIcon = getRef.isIcon(ref);
      var labelStyle = {};
      var uploaderClasses = ['uploader'];
      var uploaderLabelClasses = ['uploader__label'];

      if (loading) {
        uploaderClasses.push("uploader--progress");
      }

      if (failed) {
        uploaderClasses.push("uploader--error");
        label = failed;
      }

      if (aspect169) {
        uploaderClasses.push("uploader--16-9");
      }

      if (aspect43) {
        uploaderClasses.push("uploader--4-3");
      }

      if (draggedOver) {
        uploaderClasses.push("uploader--drag-target");
      }

      var iconClass = "";
      var iconName = "";

      if (hasRef) {
        var refInfo = getRef.parse(ref);
        uploaderClasses.push("uploader--content");
        label = "";

        if (canShowImage && !canShowVideo && !canShowIcon) {
          labelStyle = {
            "background-image": "url(" + getRef(ref, {
              url: true,
              size: 256
            }) + ")"
          };
        }

        if ((canShowImage || canShowVideo) && !canShowIcon) {
          uploaderClasses.push("uploader--image");
        }

        if (canShowVideo) {
          uploaderLabelClasses.push("video");
        }

        if (canShowIcon) {
          iconClass = refInfo.scheme + " " + refInfo.ref + " uploader__file";
          iconName = refInfo.ref;
        }
      }

      var uploaderClass = uploaderClasses.join(' ');
      var uploaderLabelClass = uploaderLabelClasses.join(' ');
      var renderedSize = 256;
      var caption = hasFilename ? filename : `None selected`;

      if (hasOriginalName) {
        caption = originalName;
      }

      if (canShowIcon) {
        caption = iconName;
      }

      return _h("div", {
        className: uploaderClass
      }, _h("div", {
        className: "uploader__internal"
      }, (canShowImage || canShowVideo) && !canShowIcon && _h("div", {
        className: "uploader__imagebackground"
      }), _h("input", {
        id: this.props.id,
        className: "uploader__input",
        type: "file",
        ref: this.inputRef,
        onChange: e => this.onSelectedFile(e),
        title: loading ? "Loading ..." : tooltip
      }), _h("label", {
        htmlFor: this.props.id,
        className: uploaderLabelClass,
        style: labelStyle
      }, loading && _h(React.Fragment, null, _h("div", {
        class: "spinner-border",
        role: "status"
      })), hasRef && !canShowImage && !canShowVideo && !canShowIcon && _h(React.Fragment, null, _h("i", {
        className: "fal fa-file uploader__file"
      })), hasRef && canShowVideo && getRef(ref, {
        size: renderedSize
      }), hasRef && canShowIcon && _h(React.Fragment, null, _h("i", {
        className: iconClass
      })), failed && _h(React.Fragment, null, _h("i", {
        class: "fas fa-times-circle"
      })), _h("span", {
        className: "uploader__label-internal"
      }, label)), loading && _h("progress", {
        className: "uploader__progress",
        max: "100",
        value: progressPercent
      })), _h("small", {
        className: "uploader__caption text-muted"
      }, caption, _h("br", null), hasMaxSize && _h(React.Fragment, null, "Max file size: ", this.formatBytes(maxSize))));
    }

  }

  exports.default = Uploader;
};__mm["UI/Failed"] = function (global, exports) {
  function Failed() {
    return _h("div", {
      className: "alert alert-danger",
      role: "alert",
      style: {
        textAlign: "center"
      }
    }, _h("i", {
      className: "fad fa-wifi-slash"
    }), _h("p", null, `The service is currently unavailable. This may be because your device is currently offline.`));
  }

  exports.default = Failed;
};__mm["UI/Projectview"] = function (global, exports) {
  function Projectview(props) {
    return _h("div", {
      className: "projectview"
    });
  }

  exports.default = Projectview;
};__mm["UI/Functions/ContentChange"] = function (global, exports) {
  const getEndpointType = _rq("UI/Functions/GetEndpointType").default;

  function contentChange(entity, endpoint, changeDetail) {
    var e = document.createEvent('Event');
    e.initEvent('contentchange', true, true);
    var endpointInfo = getEndpointType(endpoint);
    e.endpointType = endpointInfo.type;

    if (changeDetail) {
      if (changeDetail.deleted) {
        e.deleted = true;
      } else if (changeDetail.updated) {
        e.updated = true;
      } else if (changeDetail.added || changeDetail.created) {
        e.created = e.added = true;
      }
    } else {
      if (endpointInfo.isUpdate) {
        e.updated = true;
        e.updatingId = endpointInfo.updatingId;
      } else {
        e.created = e.added = true;
      }
    }

    e.change = changeDetail || {
      updated: true
    };
    e.endpoint = endpoint;
    e.entity = entity;
    document.dispatchEvent(e);
  }

  exports.default = contentChange;
};__mm["UI/Image"] = function (global, exports) {
  const getRef = _rq("UI/Functions/GetRef").default;

  const omit = _rq("UI/Functions/Omit").default;

  var logoRef = "s:ui/thirdparty/image/logo.png";

  function Image(props) {
    const {
      onClick,
      fileRef,
      linkUrl,
      size,
      fullWidth,
      float,
      className,
      animation,
      animationDirection,
      animationDuration
    } = props;
    var anim = animation ? animation : undefined;
    var animOnce = animation ? true : undefined;
    var animDuration = animationDuration > 0 ? animationDuration : undefined;

    switch (anim) {
      case 'fade':
      case 'zoom-in':
      case 'zoom-out':
        if (animationDirection) {
          anim += "-" + animationDirection;
        }

        break;

      case 'flip':
      case 'slide':
        if (animationDirection) {
          anim += "-" + animationDirection;
        } else {
          anim += "-up";
        }

        break;
    }

    var imageClass = "image";

    switch (float) {
      case "Left":
        imageClass += " image-left";
        break;

      case "Right":
        imageClass += " image-right";
        break;

      case "Center":
        imageClass += " image-center";
        break;
    }

    if (fullWidth || size == "original") {
      imageClass += " image-wide";
    }

    if (className) {
      imageClass += " " + className;
    }

    var attribs = omit(props, ['fileRef', 'onClick', 'linkUrl', 'size', 'fullWidth', 'float', 'className', 'animation', 'animationDirection', 'animationDuration']);
    attribs.alt = attribs.alt || attribs.title;

    var img = _h("div", {
      className: imageClass,
      onClick: props.onClick,
      "data-aos": linkUrl ? undefined : anim,
      "data-aos-once": linkUrl ? undefined : animOnce,
      "data-aos-duration": linkUrl ? undefined : animDuration
    }, getRef(props.fileRef, {
      attribs,
      size
    }));

    return linkUrl ? _h("a", {
      alt: attribs.alt,
      title: attribs.title,
      href: linkUrl,
      "data-aos": anim,
      "data-aos-once": animOnce,
      "data-aos-duration": animDuration
    }, img) : img;
  }

  exports.default = Image;
  Image.defaultProps = {
    fileRef: logoRef,
    float: 'None',
    animation: 'none',
    animationDirection: 'static',
    animationDuration: 400
  };
  Image.propTypes = {
    fileRef: 'string',
    linkUrl: 'string',
    title: 'string',
    fullWidth: 'bool',
    size: ['original', '2048', '1024', '512', '256', '200', '128', '100', '64', '32'],
    float: {
      type: ['None', 'Left', 'Right', 'Center']
    },
    className: 'string',
    animation: [{
      name: 'None',
      value: null
    }, {
      name: 'Fade',
      value: 'fade'
    }, {
      name: 'Flip',
      value: 'flip'
    }, {
      name: 'Slide',
      value: 'slide'
    }, {
      name: 'Zoom in',
      value: 'zoom-in'
    }, {
      name: 'Zoom out',
      value: 'zoom-out'
    }],
    animationDirection: [{
      name: 'Static',
      value: null
    }, {
      name: 'Up',
      value: 'up'
    }, {
      name: 'Down',
      value: 'down'
    }, {
      name: 'Left',
      value: 'left'
    }, {
      name: 'Right',
      value: 'right'
    }],
    animationDuration: 'int'
  };
  Image.groups = 'formatting';
  Image.icon = 'image';
};__mm["UI/Functions/GetRef"] = function (global, exports) {
  function getRef(ref, options) {
    var r = getRef.parse(ref);
    return r ? r.handler(r.ref, options || {}, r) : null;
  }

  exports.default = getRef;

  function basicUrl(url, options, r) {
    if (options.url) {
      return r.scheme + '://' + url;
    }

    return _h("img", {
      loading: "lazy",
      src: r.scheme + '://' + url,
      ...options.attribs
    });
  }

  function staticFile(ref, options, r) {
    var refParts = ref.split('/');
    var mainDir = refParts.shift();
    var cfg = global.config;
    var url = (cfg && cfg.pageRouter && cfg.pageRouter.hash ? 'pack/static/' : '/pack/static/') + refParts.join('/');

    if (mainDir.toLowerCase() == 'admin') {
      url = '/en-admin' + url;
    }

    url = (global.staticContentSource || '') + url;

    if (options.url) {
      return url;
    }

    return _h("img", {
      src: url,
      width: options.size || undefined,
      loading: "lazy",
      ...options.attribs
    });
  }

  function contentFile(ref, options, r) {
    var url = r.scheme == 'public' ? '/content/' : '/content-private/';
    var dirs = ref.split('/');
    ref = dirs.pop();

    if (options.dirs) {
      dirs = dirs.concat(options.dirs);
    }

    var hadServer = false;

    if (dirs.length > 0) {
      if (dirs[0].indexOf('.') != -1) {
        var addr = dirs.shift();
        url = '//' + addr + url;
        hadServer = true;
      }

      url += dirs.join('/') + '/';
    }

    if (!hadServer && global.contentSource) {
      url = global.contentSource + url;
    }

    var fileParts = ref.split('.');
    var id = fileParts.shift();
    var type = fileParts.join('.');

    if (options.forceImage) {
      if (imgTypes.indexOf(type) == -1) {
        type = 'webp';
      }
    }

    var video = type == 'mp4' || type == 'webm' || type == 'avif';
    url = url + id + '-';

    if (options.size && options.size.indexOf && options.size.indexOf('.') != -1) {
      url += options.size;
    } else {
      url += (video || type == 'svg' || type == 'apng' || type == 'gif' ? options.videoSize || 'original' : options.size || 'original') + (options.sizeExt || '') + '.' + type;
    }

    if (options.url) {
      return url;
    }

    if (video) {
      return _h("video", {
        src: url,
        width: options.size || 256,
        loading: "lazy",
        controls: true,
        ...options.attribs
      });
    }

    return _h("img", {
      src: url,
      width: options.size || undefined,
      loading: "lazy",
      ...options.attribs
    });
  }

  function fontAwesomeIcon(ref, options, r) {
    if (options.url) {
      return '';
    }

    var className = r.scheme + ' ' + ref;

    if (options.className) {
      className += ' ' + options.className;
    }

    return _h("i", {
      className: className,
      ...options.attribs
    });
  }

  function emojiStr(ref, options) {
    if (options.url) {
      return '';
    }

    var emojiString = String.fromCodePoint.apply(String, ref.split(',').map(num => parseInt('0x' + num)));
    return _h("span", {
      className: "emoji",
      ...options.attribs
    }, emojiString);
  }

  var protocolHandlers = {
    'public': contentFile,
    'private': contentFile,
    's': staticFile,
    'url': basicUrl,
    'http': basicUrl,
    'https': basicUrl,
    'fa': fontAwesomeIcon,
    'fas': fontAwesomeIcon,
    'far': fontAwesomeIcon,
    'fad': fontAwesomeIcon,
    'fal': fontAwesomeIcon,
    'fab': fontAwesomeIcon,
    'fr': fontAwesomeIcon,
    'emoji': emojiStr
  };

  getRef.parse = ref => {
    if (!ref) {
      return null;
    }

    if (ref.scheme) {
      return ref;
    }

    var protoIndex = ref.indexOf(':');
    var scheme = protoIndex == -1 ? 'https' : ref.substring(0, protoIndex);
    var handler = protocolHandlers[scheme];

    if (!handler) {
      return null;
    }

    ref = protoIndex == -1 ? ref : ref.substring(protoIndex + 1);
    var fileParts = null;
    var fileType = null;

    if (ref.indexOf('.') != -1) {
      fileParts = ref.split('.');
      fileType = fileParts.pop();
    }

    var refInfo = {
      scheme,
      handler,
      ref,
      fileType,
      fileParts
    };

    refInfo.toString = () => {
      if (refInfo.fileParts === null) {
        return null;
      }

      return refInfo.scheme + ':' + refInfo.fileParts.join('.') + '.' + refInfo.fileType;
    };

    return refInfo;
  };

  var imgTypes = ['png', 'jpeg', 'jpg', 'gif', 'mp4', 'svg', 'bmp', 'apng', 'avif', 'webp'];
  var vidTypes = ['mp4', 'webm', 'avif'];
  var allVidTypes = ['avi', 'wmv', 'ts', 'm3u8', 'ogv', 'flv', 'h264', 'h265', 'webm', 'ogg', 'mp4', 'mkv', 'mpeg', '3g2', '3gp', 'mov', 'media', 'avif'];
  var allIconTypes = ['fa', 'fas', 'far', 'fad', 'fal', 'fab', 'fr'];

  getRef.isImage = ref => {
    var info = getRef.parse(ref);

    if (!info) {
      return false;
    }

    if (info.scheme == 'private') {
      return false;
    } else if (info.scheme == 'url' || info.scheme == 'http' || info.scheme == 'https' || info.scheme == 'public') {
      return imgTypes.indexOf(info.fileType) != -1;
    }

    return true;
  };

  getRef.isVideo = (ref, webOnly) => {
    var info = getRef.parse(ref);

    if (!info) {
      return false;
    }

    if (info.scheme == 'private') {
      return false;
    } else if (info.scheme == 'url' || info.scheme == 'http' || info.scheme == 'https' || info.scheme == 'public') {
      return (webOnly ? vidTypes : allVidTypes).indexOf(info.fileType) != -1;
    }

    return false;
  };

  getRef.isIcon = ref => {
    var info = getRef.parse(ref);

    if (!info) {
      return false;
    }

    if (info.scheme == 'private') {
      return false;
    }

    return allIconTypes.indexOf(info.scheme) != -1;
  };
};__mm["UI/Functions/CanvasExpand"] = function (global, exports) {
  const Text = _rq("UI/Text").default;

  var inlineTypes = [TEXT, 'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'output', 'q', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'u', 'var'];
  var inlines = {};
  inlineTypes.forEach(type => {
    inlines[type] = 1;
  });
  var TEXT = '#text';

  function isCanvas2(node) {
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var n = node[i];

        if (n == null) {
          continue;
        }

        if (isCanvas2(n)) {
          return true;
        }
      }

      return false;
    }

    if (!node) {
      return false;
    }

    return node.c || node.r || node.t;
  }

  function convertToNodesFromCanvas(node, onContentNode) {
    if (!node) {
      return;
    }

    if (Array.isArray(node)) {
      node = node.filter(n => n);

      if (node.length == 1) {
        node = node[0];
      } else {
        node = {
          content: node
        };
      }
    }

    var result = {};
    var type = node.t;

    if (type) {
      if (type.indexOf('/') != -1) {
        result.typeName = type;
        result.type = require(type).default;
        result.props = result.propTypes = node.d || node.data;
        var roots = {};

        if (node.r) {
          if (Array.isArray(node.r)) {
            node.r.forEach((n, i) => {
              roots[i + ''] = convertToNodesFromCanvas({
                t: 'span',
                c: n
              }, onContentNode);
            });
          } else {
            for (var key in node.r) {
              roots[key] = convertToNodesFromCanvas({
                t: 'span',
                c: node.r[key]
              }, onContentNode);
            }
          }
        }

        if (node.c) {
          roots.children = convertToNodesFromCanvas({
            t: 'span',
            c: node.c
          }, onContentNode);
        }

        for (var k in roots) {
          var root = roots[k];
          root.type = null;
          root.parent = result;
        }

        result.roots = roots;
      } else {
        result.type = type;

        if (node.c) {
          loadCanvasChildren(node, result, onContentNode);
        }
      }
    } else if (node.c) {
      loadCanvasChildren(node, result, onContentNode);
    }

    if (node.i) {
      result.id = node.i;
    }

    if (node.ti) {
      result.templateId = node.ti;
    }

    if (node.s) {
      result.text = node.s;
      result.type = TEXT;
    }

    node.isInline = typeof node.type != 'string' || !!inlines[node.type];

    if (onContentNode) {
      if (onContentNode(result) === null) {
        return null;
      }
    }

    return result;
  }

  function loadCanvasChildren(node, result, onContentNode) {
    var c = node.c;

    if (typeof c == 'string') {
      var text = {
        type: TEXT,
        text: c,
        parent: result
      };
      result.content = [text];
    } else {
      if (!Array.isArray(c)) {
        c = [c];
      }

      var content = [];

      for (var i = 0; i < c.length; i++) {
        var child = c[i];

        if (!child) {
          continue;
        }

        if (typeof child == 'string') {
          child = {
            type: TEXT,
            text: child,
            parent: result
          };
        } else {
          child = convertToNodesFromCanvas(child, onContentNode);

          if (!child) {
            continue;
          }

          child.parent = result;
        }

        content.push(child);
      }

      result.content = content;
    }
  }

  function expand(contentNode, onContentNode) {
    if (!contentNode || contentNode.expanded) {
      return contentNode;
    }

    if (isCanvas2(contentNode)) {
      var res = convertToNodesFromCanvas(contentNode, onContentNode);
      res.expanded = true;
      res.c2 = true;
      return res;
    }

    if (Array.isArray(contentNode)) {
      var filtered = contentNode.filter(e => e != null);

      if (filtered.length == 0) {
        return null;
      } else if (filtered.length == 1) {
        return expand(filtered[0], onContentNode);
      }

      return filtered.map(e => expand(e, onContentNode));
    }

    if (!contentNode.module && contentNode.content !== undefined && !Array.isArray(contentNode.content)) {
      return {
        module: Text,
        moduleName: 'UI/Text',
        data: {
          text: contentNode.content
        },
        expanded: true
      };
    }

    if (typeof contentNode != 'object') {
      return {
        module: Text,
        moduleName: 'UI/Text',
        data: {
          text: contentNode
        },
        expanded: true
      };
    }

    if (contentNode.content !== undefined) {
      var expanded = expand(contentNode.content, onContentNode);

      if (!expanded) {
        contentNode.content = [];
      } else if (!Array.isArray(expanded)) {
        contentNode.content = [expanded];
      } else {
        contentNode.content = expanded;
      }
    } else {
      contentNode.content = [];
    }

    if (contentNode.module) {
      var mdRef = contentNode.module;
      contentNode.moduleName = mdRef;

      var module = global.require(mdRef);

      if (module) {
        contentNode.module = module.default;
        contentNode.useCanvasRender = true;
      } else {
        var first = contentNode.module.charAt(0);

        if (first == first.toUpperCase()) {
          throw new Error("Attempted to use a UI module called '" + contentNode.module + "' which you don't have installed.");
        }

        contentNode.useCanvasRender = contentNode.content != null;

        if (!Array.isArray(contentNode.content)) {
          contentNode.content = [contentNode.content];
        }

        module = contentNode.module;
      }
    } else {
      if (Array.isArray(contentNode.content)) {
        contentNode.useCanvasRender = true;
      } else {
        contentNode = contentNode.content;
      }
    }

    if (onContentNode) {
      if (onContentNode(contentNode) === null) {
        return null;
      }
    }

    contentNode.expanded = true;
    return contentNode;
  }

  exports.expand = expand;
};__mm["UI/DirectorySelect"] = function (global, exports) {
  function DirectorySelect(props) {
    return _h("div", {
      className: "directory-select"
    }, _h("button", {
      className: "btn btn-primary",
      onClick: () => {
        if (window.electronApi) {
          window.electronApi.selectFolder().then(dirName => {
            props.onSelect && props.onSelect(dirName);
          });
        } else {
          alert('Feature not available in developer UI instances. You\'ll need to build the UI and display it in the electron app to use this feature. Faking a path instead.');
          props.onSelect && props.onSelect('/var/projects/lumity/test-project/');
        }
      }
    }, props.label || `Browse for a directory`));
  }

  exports.default = DirectorySelect;
};__mm["UI/Functions/Logout"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  function clearAndNav(url, setSession, setPage, ctx) {
    if (ctx) {
      setSession(ctx);
    } else {
      setSession({
        user: null,
        realUser: null,
        role: {
          id: 0
        },
        loadingUser: false
      }, true);
    }

    setPage(url);
  }

  exports.default = (url, setSession, setPage) => {
    if (!setSession || !setPage) {
      throw new Error('Logout requires ctx');
    }

    return webRequest('user/logout').then(response => clearAndNav(url || '/', setSession, setPage, response.json)).catch(e => clearAndNav(url || '/', setSession, setPage));
  };
};__mm["UI/Functions/DateTools"] = function (global, exports) {
  function ordinal(i) {
    var j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
      return i + "st";
    }

    if (j == 2 && k != 12) {
      return i + "nd";
    }

    if (j == 3 && k != 13) {
      return i + "rd";
    }

    return i + "th";
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const epochTicks = 62135596800000;
  const ticksPerMillisecond = 10000;

  const ticks = date => {
    return epochTicks + date.getTime() * ticksPerMillisecond;
  };

  const isoConvert = isoish => {
    var type = typeof isoish;

    if (type == 'number') {
      return new Date(isoish - epochTicks);
    }

    if (type != 'string') {
      if (isoish && isoish.valueOf) {
        return new Date(isoish.valueOf());
      }

      return isoish;
    }

    var dateParts = isoish.split(/\D+/);
    var returnDate = new Date();
    returnDate.setUTCFullYear(parseInt(dateParts[0]), parseInt(dateParts[1] - 1), parseInt(dateParts[2]));
    returnDate.setUTCHours(parseInt(dateParts[3]), parseInt(dateParts[4]), parseInt(dateParts[5]));
    var timezoneOffsetHours = 0;

    if (dateParts[7] || dateParts[8]) {
      var timezoneOffsetMinutes = 0;

      if (dateParts[8]) {
        timezoneOffsetMinutes = parseInt(dateParts[8]) / 60;
      }

      timezoneOffsetHours = parseInt(dateParts[7]) + timezoneOffsetMinutes;

      if (isoish.substr(-6, 1) == "+") {
        timezoneOffsetHours *= -1;
      }

      returnDate.setUTCHours(parseInt(dateParts[3]) + timezoneOffsetHours);
      returnDate.setUTCMinutes(parseInt(dateParts[4]) + timezoneOffsetMinutes);
    }

    return returnDate;
  };

  function localToUtc(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));
  }

  function utcToLocal(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }

  function getMonday(date) {
    d = new Date(date);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function getSunday(date) {
    d = new Date(date);
    var day = d.getDay(),
        diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  function addDays(date, days) {
    var date = new Date(date.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  function addHours(date, hours) {
    return addMinutes(date, hours * 60);
  }

  function addMinutes(date, minutes) {
    var date = new Date(date.valueOf() + 1000 * 60 * minutes);
    return date;
  }

  function addSeconds(date, seconds) {
    var date = new Date(date.valueOf() + 1000 * seconds);
    return date;
  }

  function daysUntilDate(date) {
    var start = isoConvert(date);
    var currentTimeUTC = new Date();
    var diff = start.getTime() - currentTimeUTC.getTime();
    var days = Math.ceil(diff / (1000 * 3600 * 24));

    switch (days) {
      case 0:
      case 1:
        return start.setHours(0, 0, 0, 0) == currentTimeUTC.setHours(0, 0, 0, 0) ? 0 : 1;

      default:
        return days;
    }
  }

  function daysBetween(startdate, enddate) {
    var start = isoConvert(startdate).setHours(0, 0, 0, 0);
    var end = isoConvert(enddate).setHours(0, 0, 0, 0);
    var diff = end - start;
    var days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
  }

  function minsBetween(startdate, enddate) {
    var start = isoConvert(startdate);
    var end = isoConvert(enddate);
    var diff = Math.abs(end - start);
    var mins = Math.floor(diff / 1000 / 60);
    return mins;
  }

  exports.ordinal = ordinal;
  exports.dayNames = dayNames;
  exports.shortDayNames = shortDayNames;
  exports.monthNames = monthNames;
  exports.shortMonthNames = shortMonthNames;
  exports.isoConvert = isoConvert;
  exports.utcToLocal = utcToLocal;
  exports.localToUtc = localToUtc;
  exports.getMonday = getMonday;
  exports.getSunday = getSunday;
  exports.addDays = addDays;
  exports.addMinutes = addMinutes;
  exports.addHours = addHours;
  exports.addSeconds = addSeconds;
  exports.daysUntilDate = daysUntilDate;
  exports.daysBetween = daysBetween;
  exports.minsBetween = minsBetween;
  exports.ticks = ticks;
};__mm["UI/Column"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Column(props) {
    var colClass = '';
    var sizeMd = props.sizeMd || props.size || (!props.sizeXs && !props.sizeMd ? 6 : undefined);

    if (props.offset) {
      if (!props.offsetXs) {
        props.offsetXs = props.offset;
      }

      if (!props.offsetSm) {
        props.offsetSm = props.offset;
      }

      if (!props.offsetMd) {
        props.offsetMd = props.offset;
      }

      if (!props.offsetLg) {
        props.offsetLg = props.offset;
      }

      if (!props.offsetXl) {
        props.offsetXl = props.offset;
      }
    }

    if (props.sizeXs) {
      colClass = 'col-' + props.sizeXs;
    }

    if (props.sizeSm) {
      colClass += ' col-sm-' + props.sizeSm;
    }

    if (sizeMd) {
      colClass += ' col-md-' + sizeMd;
    }

    if (props.sizeLg) {
      colClass += ' col-lg-' + props.sizeLg;
    }

    if (props.sizeXl) {
      colClass += ' col-xl-' + props.sizeXl;
    }

    if (props.offsetXs) {
      colClass += ' offset-' + props.offsetXs;
    }

    if (props.offsetSm) {
      colClass += ' offset-sm-' + props.offsetSm;
    }

    if (props.offsetMd) {
      colClass += ' offset-md-' + props.offsetMd;
    }

    if (props.offsetLg) {
      colClass += ' offset-lg-' + props.offsetLg;
    }

    if (props.offsetXl) {
      colClass += ' offset-xl-' + props.offsetXl;
    }

    if (props.margin) {
      colClass += ' ' + props.margin;
    }

    if (props.noGutters) {
      colClass += ' gx-0';
    }

    if (props.className) {
      colClass += ' ' + props.className;
    }

    return _h("div", {
      className: colClass,
      ...omit(props, ['className', 'noGutters'])
    }, props.children);
  }

  exports.default = Column;
  var sizeOptions = [{
    name: 'Auto',
    value: 'auto'
  }, {
    name: '1/12',
    value: 1
  }, {
    name: '2/12',
    value: 2
  }, {
    name: '3/12 (25%)',
    value: 3
  }, {
    name: '4/12 (33%)',
    value: 4
  }, {
    name: '5/12',
    value: 5
  }, {
    name: '6/12 (50%)',
    value: 6
  }, {
    name: '7/12',
    value: 7
  }, {
    name: '8/12 (66%)',
    value: 8
  }, {
    name: '9/12 (75%)',
    value: 9
  }, {
    name: '10/12',
    value: 10
  }, {
    name: '11/12',
    value: 11
  }, {
    name: '12/12 (100%)',
    value: 12
  }];
  var offsetOptions = sizeOptions.slice(1);
  offsetOptions.splice(0, 0, {
    name: 'No offset',
    value: 0
  });
  var marginOptions = [{
    name: 'None',
    value: ''
  }, {
    name: 'Move sibling columns right',
    value: 'ml-auto ms-auto'
  }, {
    name: 'Move sibling columns left',
    value: 'mr-auto me-auto'
  }, {
    name: 'Move sibling columns left/right',
    value: 'mx-auto'
  }];
  Column.propTypes = {
    noGutters: 'boolean',
    size: sizeOptions,
    sizeXs: sizeOptions,
    sizeSm: sizeOptions,
    sizeMd: sizeOptions,
    sizeLg: sizeOptions,
    sizeXl: sizeOptions,
    offset: offsetOptions,
    offsetXs: offsetOptions,
    offsetSm: offsetOptions,
    offsetMd: offsetOptions,
    offsetLg: offsetOptions,
    offsetXl: offsetOptions,
    margin: marginOptions,
    children: true
  };
  Column.icon = 'columns';
};__mm["UI/Row"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Row(props) {
    var rowClass = "row ";

    if (props.noGutters) {
      rowClass += "gx-0 ";
    }

    if (props.horizontalAlignment) {
      rowClass += "justify-content-" + props.horizontalAlignment + " ";
    }

    if (props.className) {
      rowClass += props.className;
    }

    return _h("div", {
      className: rowClass,
      ...omit(props, ['className', 'noGutters'])
    }, props.children);
  }

  exports.default = Row;
  Row.propTypes = {
    noGutters: 'boolean',
    horizontalAlignment: [{
      name: 'No preference',
      value: ''
    }, {
      name: 'Align left',
      value: 'start'
    }, {
      name: 'Align centre',
      value: 'center'
    }, {
      name: 'Align right',
      value: 'end'
    }, {
      name: 'Distribute space around',
      value: 'around'
    }, {
      name: 'Distribute space between',
      value: 'between'
    }],
    children: {
      default: [{
        module: "UI/Column",
        content: "Column 1"
      }, {
        module: "UI/Column",
        content: "Column 2"
      }]
    }
  };
  Row.icon = 'columns';
};__mm["UI/PageRouter"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  const Canvas = _rq("UI/Canvas").default;

  const Router = _rq("UI/Session").Router;

  const getBuildDate = _rq("UI/Functions/GetBuildDate").default;

  const {
    config,
    location
  } = global;
  const routerCfg = config && config.pageRouter || {};
  const {
    hash,
    localRouter
  } = routerCfg;

  function currentUrl() {
    var _location$hash$substr, _location$hash;

    return hash ? (_location$hash$substr = (_location$hash = location.hash) === null || _location$hash === void 0 ? void 0 : _location$hash.substring(1)) !== null && _location$hash$substr !== void 0 ? _location$hash$substr : "/" : `${location.pathname}${location.search}`;
  }

  const initialUrl = currentUrl();
  const initState = localRouter ? localRouter(initialUrl, webRequest) : global.pgState || {};

  if (!initState.loading) {
    triggerEvent(initState.page);
  }

  function triggerEvent(pgInfo) {
    if (pgInfo) {
      var e;

      if (typeof Event === 'function') {
        e = new Event('xpagechange');
      } else {
        e = document.createEvent('Event');
        e.initEvent('xpagechange', true, true);
      }

      e.pageInfo = pgInfo;
      global.dispatchEvent(e);
    }
  }

  function historyLength() {
    return window && window.history ? window.history.length : 0;
  }

  var initLength = historyLength();

  function canGoBack() {
    return historyLength() > initLength;
  }

  exports.default = props => {
    var [pageState, setPage] = React.useState({
      url: initialUrl,
      ...initState
    });

    if (pageState.loading && !pageState.handled) {
      pageState.loading.then(pgState => {
        triggerEvent(pgState.page);
        setPage(pgState);
      });
      pageState.handled = true;
    }

    function go(url) {
      if (window.beforePageLoad) {
        window.beforePageLoad(url).then(() => {
          window.beforePageLoad = null;
          goNow(url);
        }).catch(e => console.log(e));
      } else {
        goNow(url);
      }
    }

    function goNow(url) {
      if (useDefaultNav(document.location.pathname, url)) {
        document.location = url;
        return;
      }

      var html = document.body.parentNode;
      global.history.replaceState({
        scrollTop: html.scrollTop,
        scrollLeft: html.scrollLeft
      }, '');
      global.history.pushState({
        scrollTop: 0
      }, '', hash ? '#' + url : url);
      return setPageState(url).then(() => {
        html.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      });
    }

    function useDefaultNav(a, b) {
      if (b.indexOf(':') != -1 || b[0] == '#' || b[0] == '/' && b.length > 1 && b[1] == '/') {
        return true;
      }

      var isOnExternPage = a.indexOf('/en-admin') == 0 || a.indexOf('/v1') == 0;
      var targetIsExternPage = b[0] == '/' ? b.indexOf('/en-admin') == 0 || b.indexOf('/v1') == 0 : isOnExternPage;
      return isOnExternPage != targetIsExternPage;
    }

    function setPageState(url) {
      if (localRouter) {
        var pgState = localRouter(url, webRequest);
        pgState.url = url;

        if (pgState.loading) {
          pgState.loading.then(pgState => {
            setPage(pgState);
            triggerEvent(pgState);
          });
        } else {
          setPage(pgState);
          triggerEvent(pgState);
        }

        return Promise.resolve(true);
      } else {
        return webRequest("page/state", {
          url,
          version: getBuildDate().timestamp
        }).then(res => {
          if (res.json.oldVersion) {
            console.log("UI updated - forced reload");
            document.location = url;
            return;
          } else if (res.json.redirect) {
            console.log("Redirect");
            document.location = res.json.redirect;
            return;
          }

          var {
            config
          } = res.json;

          if (config) {
            delete res.json.config;
            global.__cfg = config;
          }

          var pgState = {
            url,
            ...res.json
          };
          setPage(pgState);
          triggerEvent(res.json);
        });
      }
    }

    const onPopState = e => {
      var scrollTarget = null;

      if (e && e.state && e.state.scrollTop !== undefined) {
        scrollTarget = {
          x: e.state.scrollLeft,
          y: e.state.scrollTop
        };
      }

      setPageState(currentUrl()).then(() => {
        if (scrollTarget) {
          document.body.parentNode.scrollTo({
            top: scrollTarget.y,
            left: scrollTarget.x,
            behavior: 'instant'
          });
        }
      });
    };

    const onLinkClick = e => {
      if (e.button != 0 || e.defaultPrevented) {
        return;
      }

      var cur = e.target;

      while (cur && cur != document) {
        if (cur.nodeName == 'A') {
          var href = cur.getAttribute('href');

          if (cur.getAttribute('target') || cur.getAttribute('download')) {
            return;
          }

          if (href && href.length) {
            var pn = document.location.pathname;

            if (useDefaultNav(pn, href)) {
              return;
            }

            e.preventDefault();
            go(cur.pathname + cur.search);
            return;
          }
        }

        cur = cur.parentNode;
      }
    };

    React.useEffect(() => {
      const onContentChange = e => {
        var {
          po
        } = pageState;

        if (po && po.type == e.type && po.id == e.entity.id) {
          var pgState = { ...pageState,
            po: e.entity
          };
          setPage(pgState);
        }
      };

      const onWsMessage = e => {
        var {
          po
        } = pageState;

        if (po && po.type == e.message.type && po.id == e.message.entity.id) {
          var pgState = { ...pageState,
            po: e.message.entity
          };
          setPage(pgState);
        }
      };

      window.addEventListener("popstate", onPopState);
      document.addEventListener("click", onLinkClick);
      document.addEventListener("contentchange", onContentChange);
      document.addEventListener("websocketmessage", onWsMessage);
      return () => {
        window.removeEventListener("popstate", onPopState);
        document.removeEventListener("click", onLinkClick);
        document.removeEventListener("contentchange", onContentChange);
        document.removeEventListener("websocketmessage", onWsMessage);
      };
    }, []);
    var {
      page
    } = pageState;
    React.useEffect(() => {
      if (pageState && pageState.title) {
        document.title = pageState.title;
      }
    });
    return _h(Router.Provider, {
      value: {
        canGoBack,
        pageState,
        setPage: go
      }
    }, page ? _h(Canvas, null, page.bodyJson) : null);
  };
};__mm["UI/HasCapability"] = function (global, exports) {
  const hasCapability = _rq("UI/Functions/HasCapability").default;

  const useSession = _rq("UI/Session").useSession;

  exports.default = props => {
    const [granted, setGranted] = React.useState(false);
    const {
      session
    } = useSession();
    React.useEffect(() => {
      hasCapability(props.called, session).then(grant => {
        grant != granted && setGranted(grant);
      });
    });
    var g = granted;
    props.invert && (g = !g);
    return g ? props.children : null;
  };
};__mm["UI/Start/App"] = function (global, exports) {
  const PageRouter = _rq("UI/PageRouter").default;

  function App(props) {
    var tree = _h(PageRouter, null);

    props.providers.forEach(Element => {
      tree = _h(Element, null, tree);
    });
    return tree;
  }

  exports.default = App;
};__mm["UI/Container"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  const container = props => _h("div", {
    className: "container" + (props.type ? "-" + props.type : '') + " " + (props.className || ''),
    ...omit(props, ['type', 'children', 'className'])
  }, props.children);

  exports.default = container;
  container.propTypes = {
    type: ['', 'sm', 'md', 'lg', 'xl'],
    children: true
  };
  container.icon = 'cube';
};__mm["UI/Spacer"] = function (global, exports) {
  function Spacer(props) {
    return _h("div", {
      className: "spacer-container",
      "data-theme": props['data-theme']
    }, _h("div", {
      className: "spacer",
      style: {
        height: props.height ? props.height + 'px' : '20px'
      }
    }));
  }

  exports.default = Spacer;
  Spacer.propTypes = {
    height: 'int'
  };
  Spacer.icon = 'sort';
};__mm["UI/Functions/IsNumeric"] = function (global, exports) {
  exports.default = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };
};__mm["UI/Dropdown"] = function (global, exports) {
  const {
    useState,
    useEffect,
    useRef
  } = global.React;

  const {
    tabNext,
    tabPrev
  } = _rq("UI/Functions/Tabbable");

  let lastId = 0;

  function newId() {
    lastId++;
    return `dropdown${lastId}`;
  }

  function Dropdown(props) {
    var {
      className,
      variant,
      title,
      label,
      arrow,
      isOutline,
      isLarge,
      isSmall,
      splitCallback,
      children,
      stayOpenOnSelection,
      align,
      position
    } = props;
    var dropdownClasses = ['dropdown'];

    if (className) {
      dropdownClasses.push(className);
    }

    if (splitCallback) {
      dropdownClasses.push('dropdown--split');
    }

    if (!position || position.length == 0) {
      position = "Bottom";
    }

    position = position.toLowerCase();

    if (!align) {
      align = "";
    }

    align = align.toLowerCase();

    switch (position) {
      case 'top':
      case 'bottom':
        if (align == "top" || align == "bottom") {
          align = "";
        }

        break;

      case 'left':
      case 'right':
        if (align == "left" || align == "right") {
          align = "";
        }

        break;
    }

    if (!align || align.length == 0) {
      switch (position) {
        case 'top':
        case 'bottom':
          align = "Left";
          break;

        case 'left':
        case 'right':
          align = "Top";
          break;
      }
    }

    dropdownClasses.push('dropdown--align-' + align);
    dropdownClasses.push('dropdown--position-' + position);
    const [open, setOpen] = useState(false);
    const dropdownWrapperRef = useRef(null);
    const toggleRef = useRef(null);
    const dropdownRef = useRef(null);
    var menuItems, firstMenuItem, lastMenuItem;

    if (!variant) {
      variant = "primary";
    }

    var btnClass = isOutline ? "btn btn-outline-" + variant : "btn btn-" + variant;

    if (isSmall) {
      btnClass += " btn-sm";
    }

    if (isLarge) {
      btnClass += " btn-lg";
    }

    var btnClassSplit = btnClass + " dropdown-toggle";
    const [dropdownId] = useState(newId());

    if (!label) {
      label = _h(React.Fragment, null, "Dropdown");
    }

    if (!arrow) {
      arrow = _h(React.Fragment, null, _h("svg", {
        className: "dropdown__chevron",
        xmlns: "http://www.w3.org/2000/svg",
        overflow: "visible",
        viewBox: "0 0 58 34"
      }, _h("path", {
        d: "M29 34c-1.1 0-2.1-.4-2.9-1.2l-25-26c-1.5-1.6-1.5-4.1.1-5.7 1.6-1.5 4.1-1.5 5.7.1l22.1 23 22.1-23c1.5-1.6 4.1-1.6 5.7-.1s1.6 4.1.1 5.7l-25 26c-.8.8-1.8 1.2-2.9 1.2z",
        fill: "currentColor"
      })));
    }

    function handleClick(event) {
      if (toggleRef && toggleRef.current == event.target) {
        if (dropdownRef && dropdownRef.current) {
          closeDropdown();
        } else {
          setOpen(true);
        }

        return;
      }

      var target = event.target;
      var isFormControl = target.type == 'radio' || target.type == 'checkbox' || target.nodeName.toUpperCase() == 'LABEL' && target.classList.contains("form-check-label");

      if (!stayOpenOnSelection && !isFormControl) {
        closeDropdown();
      } else {
        if (dropdownWrapperRef && !dropdownWrapperRef.current.contains(event.target)) {
          closeDropdown();
        }
      }
    }

    function checkShiftTab(event) {
      if (event.keyCode === 9 && event.shiftKey) {
        closeDropdown();
      }

      if (event.keyCode === 40) {
        event.preventDefault();
        tabNext();
      }
    }

    function checkCursorKey(event) {
      if (event.keyCode === 38 && event.target != firstMenuItem) {
        event.preventDefault();
        tabPrev();
      }

      if (event.keyCode === 40 && event.target != lastMenuItem) {
        event.preventDefault();
        tabNext();
      }
    }

    function checkTab(event) {
      if (event.keyCode === 9 && !event.shiftKey) {
        closeDropdown();
      }
    }

    function closeDropdown() {
      if (menuItems) {
        menuItems.forEach(menuItem => {
          menuItem.removeEventListener("keydown", checkCursorKey);
        });
      }

      if (lastMenuItem) {
        lastMenuItem.removeEventListener("keydown", checkTab);
      }

      menuItems = undefined;
      firstMenuItem = undefined;
      lastMenuItem = undefined;
      setOpen(false);
    }

    useEffect(() => {
      if (dropdownWrapperRef && dropdownWrapperRef.current) {
        dropdownWrapperRef.current.ownerDocument.addEventListener("click", handleClick);
      }

      if (toggleRef && toggleRef.current) {
        toggleRef.current.addEventListener("keydown", checkShiftTab);
      }

      return () => {
        if (dropdownWrapperRef && dropdownWrapperRef.current) {
          dropdownWrapperRef.current.ownerDocument.removeEventListener("click", handleClick);
        }

        if (toggleRef && toggleRef.current) {
          toggleRef.current.removeEventListener("keydown", checkShiftTab);
        }
      };
    }, []);
    useEffect(() => {
      if (!dropdownRef || !dropdownRef.current) {
        return;
      }

      menuItems = dropdownRef.current.querySelectorAll("li > .dropdown-item");
      menuItems.forEach(menuItem => {
        menuItem.addEventListener("keydown", checkCursorKey);
      });

      if (open && dropdownRef) {
        firstMenuItem = dropdownRef.current.querySelector("li:first-child > .dropdown-item");
        lastMenuItem = dropdownRef.current.querySelector("li:last-child > .dropdown-item");

        if (lastMenuItem) {
          lastMenuItem.addEventListener("keydown", checkTab);
        }
      }
    }, [open]);
    return _h("div", {
      title: title,
      className: dropdownClasses.join(' '),
      ref: dropdownWrapperRef
    }, !splitCallback && _h("button", {
      className: btnClassSplit,
      type: "button",
      id: dropdownId,
      "aria-expanded": open,
      ref: toggleRef
    }, position == "left" && _h(React.Fragment, null, _h("span", {
      className: "dropdown__arrow"
    }, arrow), _h("span", {
      className: "dropdown__label"
    }, label)), position != "left" && _h(React.Fragment, null, _h("span", {
      className: "dropdown__label"
    }, label), _h("span", {
      className: "dropdown__arrow"
    }, arrow))), splitCallback && _h(React.Fragment, null, _h("button", {
      className: btnClass,
      type: "button",
      id: dropdownId,
      onClick: splitCallback
    }, _h("span", {
      className: "dropdown__label"
    }, label)), _h("button", {
      className: btnClassSplit,
      type: "button",
      "aria-expanded": open,
      ref: toggleRef
    }, _h("span", {
      className: "dropdown__arrow"
    }, arrow))), open && _h("ul", {
      className: "dropdown-menu",
      "aria-labelledby": dropdownId,
      ref: dropdownRef
    }, children));
  }

  exports.default = Dropdown;
  Dropdown.propTypes = {
    stayOpenOnSelection: 'bool',
    align: ['Top', 'Bottom', 'Left', 'Right'],
    position: ['Top', 'Bottom', 'Left', 'Right']
  };
  Dropdown.defaultProps = {
    stayOpenOnSelection: false,
    align: 'Left',
    position: 'Bottom'
  };
  Dropdown.icon = 'caret-square-down';
};__mm["UI/Functions/FormatTime"] = function (global, exports) {
  const dateTools = _rq("UI/Functions/DateTools");

  const longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
      return i + "st";
    }

    if (j == 2 && k != 12) {
      return i + "nd";
    }

    if (j == 3 && k != 13) {
      return i + "rd";
    }

    return i + "th";
  }

  exports.ordinal_suffix_of = ordinal_suffix_of;

  function FormatTime(date, format, noTime = false, delimiter = null, noDate = false, isHtml = false) {
    if (!date || noDate && noTime) {
      return '-';
    }

    date = dateTools.isoConvert(date);
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var hour = date.getHours();
    var minute = date.getMinutes();
    var evening = false;

    if (hour >= 12) {
      evening = true;
      hour -= 12;
    }

    if (hour == 0) {
      hour = 12;
    }

    now = new Date();
    var meridiem = "";
    evening ? meridiem = "PM" : meridiem = "AM";

    if (minute < 10) {
      minute = "0" + minute;
    }

    if (format == "us") {
      var dateString = "";

      if (!noDate) {
        dateString += month + "/" + day + "/" + year;
      }

      if (!noTime) {
        if (isHtml) {
          dateString += "<time>";
        }

        dateString += " " + hour + ":" + minute + " " + meridiem;

        if (isHtml) {
          dateString += "</time>";
        }
      }

      return dateString;
    } else if (format == "eu") {
      if (!delimiter) {
        delimiter = "-";
      }

      var dateString = "";

      if (!noDate) {
        dateString += day + delimiter + month + delimiter + year;
      }

      if (!noTime) {
        if (isHtml) {
          dateString += "<time>";
        }

        dateString += " " + hour + ":" + minute + " " + meridiem;

        if (isHtml) {
          dateString += "</time>";
        }
      }

      return dateString;
    } else if (format == "eu-readable") {
      var dateString = "";

      if (!noDate) {
        dateString += ordinal_suffix_of(day) + " " + longMonths[month - 1] + " " + year;
      }

      if (!noTime) {
        if (isHtml) {
          dateString += "<time>";
        }

        dateString += " " + hour + ":" + minute + " " + meridiem;

        if (isHtml) {
          dateString += "</time>";
        }
      }

      return dateString;
    } else {
      var dateString = "";

      if (!noDate) {
        dateString += day + "-" + month + "-" + year;
      }

      if (!noTime) {
        if (isHtml) {
          dateString += "<time>";
        }

        dateString += " " + hour + ":" + minute + " " + meridiem;

        if (isHtml) {
          dateString += "</time>";
        }
      }

      return dateString;
    }
  }

  exports.default = FormatTime;
};__mm["UI/Functions/Tabbable"] = function (global, exports) {
  const candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])', 'details>summary:first-of-type', 'details'];
  const candidateSelector = candidateSelectors.join(',');
  const matches = typeof Element === 'undefined' ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

  const getCandidates = function (el, includeContainer, filter) {
    let candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));

    if (includeContainer && matches.call(el, candidateSelector)) {
      candidates.unshift(el);
    }

    candidates = candidates.filter(filter);
    return candidates;
  };

  const isContentEditable = function (node) {
    return node.contentEditable === 'true';
  };

  const getTabindex = function (node) {
    const tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);

    if (!isNaN(tabindexAttr)) {
      return tabindexAttr;
    }

    if (isContentEditable(node)) {
      return 0;
    }

    if ((node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') && node.getAttribute('tabindex') === null) {
      return 0;
    }

    return node.tabIndex;
  };

  const sortOrderedTabbables = function (a, b) {
    return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
  };

  const isInput = function (node) {
    return node.tagName === 'INPUT';
  };

  const isHiddenInput = function (node) {
    return isInput(node) && node.type === 'hidden';
  };

  const isDetailsWithSummary = function (node) {
    const r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(child => child.tagName === 'SUMMARY');
    return r;
  };

  const getCheckedRadio = function (nodes, form) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].checked && nodes[i].form === form) {
        return nodes[i];
      }
    }
  };

  const isTabbableRadio = function (node) {
    if (!node.name) {
      return true;
    }

    const radioScope = node.form || node.ownerDocument;

    const queryRadios = function (name) {
      return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
    };

    let radioSet;

    if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
      radioSet = queryRadios(window.CSS.escape(node.name));
    } else {
      try {
        radioSet = queryRadios(node.name);
      } catch (err) {
        console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
        return false;
      }
    }

    const checked = getCheckedRadio(radioSet, node.form);
    return !checked || checked === node;
  };

  const isRadio = function (node) {
    return isInput(node) && node.type === 'radio';
  };

  const isNonTabbableRadio = function (node) {
    return isRadio(node) && !isTabbableRadio(node);
  };

  const isHidden = function (node, displayCheck) {
    if (getComputedStyle(node).visibility === 'hidden') {
      return true;
    }

    const isDirectSummary = matches.call(node, 'details>summary:first-of-type');
    const nodeUnderDetails = isDirectSummary ? node.parentElement : node;

    if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
      return true;
    }

    if (!displayCheck || displayCheck === 'full') {
      while (node) {
        if (getComputedStyle(node).display === 'none') {
          return true;
        }

        node = node.parentElement;
      }
    } else if (displayCheck === 'non-zero-area') {
      const {
        width,
        height
      } = node.getBoundingClientRect();
      return width === 0 && height === 0;
    }

    return false;
  };

  const isNodeMatchingSelectorFocusable = function (options, node) {
    if (node.disabled || isHiddenInput(node) || isHidden(node, options.displayCheck) || isDetailsWithSummary(node)) {
      return false;
    }

    return true;
  };

  const isNodeMatchingSelectorTabbable = function (options, node) {
    if (!isNodeMatchingSelectorFocusable(options, node) || isNonTabbableRadio(node) || getTabindex(node) < 0) {
      return false;
    }

    return true;
  };

  const tabbable = function (el, options) {
    options = options || {};
    const regularTabbables = [];
    const orderedTabbables = [];
    const candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
    candidates.forEach(function (candidate, i) {
      const candidateTabindex = getTabindex(candidate);

      if (candidateTabindex === 0) {
        regularTabbables.push(candidate);
      } else {
        orderedTabbables.push({
          documentOrder: i,
          tabIndex: candidateTabindex,
          node: candidate
        });
      }
    });
    const tabbableNodes = orderedTabbables.sort(sortOrderedTabbables).map(a => a.node).concat(regularTabbables);
    return tabbableNodes;
  };

  const focusable = function (el, options) {
    options = options || {};
    const candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
    return candidates;
  };

  const isTabbable = function (node, options) {
    options = options || {};

    if (!node) {
      throw new Error('No node provided');
    }

    if (matches.call(node, candidateSelector) === false) {
      return false;
    }

    return isNodeMatchingSelectorTabbable(options, node);
  };

  const focusableCandidateSelector = candidateSelectors.concat('iframe').join(',');

  const isFocusable = function (node, options) {
    options = options || {};

    if (!node) {
      throw new Error('No node provided');
    }

    if (matches.call(node, focusableCandidateSelector) === false) {
      return false;
    }

    return isNodeMatchingSelectorFocusable(options, node);
  };

  const tabNext = function (el) {
    el = el || document.body;
    var tabbableNodes = tabbable(el);

    if (!tabbableNodes.includes(document.activeElement)) {
      return;
    }

    var tabIndex = tabbableNodes.indexOf(document.activeElement);

    if (tabIndex == tabbableNodes.length - 1) {
      tabbableNodes[0].focus();
    } else {
      tabbableNodes[tabIndex + 1].focus();
    }
  };

  const tabPrev = function (el) {
    el = el || document.body;
    var tabbableNodes = tabbable(el);

    if (!tabbableNodes.includes(document.activeElement)) {
      return;
    }

    var tabIndex = tabbableNodes.indexOf(document.activeElement);

    if (tabIndex == 0) {
      tabbableNodes[tabbableNodes.length - 1].focus();
    } else {
      tabbableNodes[tabIndex - 1].focus();
    }
  };

  exports.tabbable = tabbable;
  exports.focusable = focusable;
  exports.isTabbable = isTabbable;
  exports.isFocusable = isFocusable;
  exports.tabNext = tabNext;
  exports.tabPrev = tabPrev;
};__mm["UI/NavMenu"] = function (global, exports) {
  const Loop = _rq("UI/Loop").default;

  const Canvas = _rq("UI/Canvas").default;

  const isNumeric = _rq("UI/Functions/IsNumeric").default;

  exports.default = props => {
    var filter = props.filter || {};

    if (!filter.where) {
      filter.where = {};
    }

    if (isNumeric(props.id)) {
      filter.where.NavMenuId = props.id;
    } else {
      filter.where.MenuKey = props.id;
    }

    if (!filter.sort) {
      filter.sort = {
        field: 'Order'
      };
    }

    return _h(Loop, {
      over: 'navmenuitem/list',
      ...props,
      filter: filter
    }, props.children && props.children.length ? props.children : item => _h("a", {
      href: item.target
    }, _h(Canvas, null, item.bodyJson)));
  };
};__mm["UI/Modal"] = function (global, exports) {
  const getRef = _rq("UI/Functions/GetRef").default;

  var titleId = 1;

  class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.newTitleId();
    }

    newTitleId() {
      this.modalTitleId = 'modal_title_' + titleId++;
    }

    backdropClassName() {
      let classes = 'modal-backdrop show';
      return classes;
    }

    modalClassName() {
      let classes = this.props.className || "";
      classes += " modal";

      if (this.props.fade) {
        classes += " fade";
      } else {
        classes += " show";
      }

      return classes;
    }

    modalDialogClassName() {
      let classes = 'modal-dialog show';

      if (!this.props.isNotCentred) {
        classes += ' modal-dialog-centered';
      }

      if (!this.props.isNotScrollable) {
        classes += ' modal-dialog-scrollable';
      }

      if (this.props.isSmall) {
        classes += ' modal-sm';
      }

      if (this.props.isLarge) {
        classes += ' modal-lg';
      }

      if (this.props.isExtraLarge) {
        classes += ' modal-xl';
      }

      if (this.props.customClass) {
        classes += ' ' + this.props.customClass;
      }

      return classes;
    }

    closeModal() {
      if (this.props.hideSelector) {
        const hideElements = Array.prototype.slice.apply(document.querySelectorAll(this.props.hideSelector));
        hideElements.forEach(element => {
          element.classList.remove("hidden-by-modal");
        });
      }

      this.props.onClose && this.props.onClose();
    }

    render() {
      if (!this.props.visible) {
        return null;
      }

      if (this.props.hideSelector) {
        const hideElements = Array.prototype.slice.apply(document.querySelectorAll(this.props.hideSelector));
        hideElements.forEach(element => {
          element.classList.add("hidden-by-modal");
        });
      }

      var style = {};

      if (this.props.backgroundImageRef) {
        style.backgroundImage = "url(" + getRef(this.props.backgroundImageRef, {
          url: true
        }) + ")";
        style.height = "690px";
        style.backgroundPosition = "center";
        style.backgroundRepeat = "no-repeat";
        style.backgroundSize = "cover";
      }

      var closeClass = this.props.closeIcon ? "close btn-close custom-icon" : "close btn-close";
      var closeIconClass = this.props.closeIcon ? "close-icon custom-icon-content" : "close-icon";
      return [this.props.noBackdrop ? null : _h("div", {
        className: this.backdropClassName(),
        onClick: () => this.closeModal()
      }), _h("div", {
        className: this.modalClassName(),
        tabIndex: "-1",
        role: "dialog",
        "aria-labelledby": this.modalTitleId,
        "data-theme": this.props['data-theme'] || 'modal-theme',
        onTouchStart: e => e.stopPropagation()
      }, _h("div", {
        className: this.modalDialogClassName(),
        role: "document"
      }, _h("div", {
        className: "modal-content",
        style: style
      }, this.props.noHeader ? _h(React.Fragment, null) : _h("div", {
        className: "modal-header"
      }, _h("div", {
        className: "modal-title",
        id: this.modalTitleId
      }, typeof this.props.title === 'string' ? _h("h5", null, this.props.title) : this.props.title), this.props.noClose ? _h(React.Fragment, null) : _h("button", {
        type: "button",
        className: closeClass,
        "data-dismiss": "modal",
        "aria-label": "Close",
        onClick: () => this.closeModal()
      }, _h("span", {
        "aria-hidden": "true",
        className: closeIconClass
      }, !this.props.closeIcon && _h(React.Fragment, null, "\xD7"), this.props.closeIcon && _h(React.Fragment, null, this.props.closeIcon)))), _h("div", {
        className: "modal-body"
      }, this.props.children), _h("div", {
        className: "modal-footer"
      }, this.props.footer ? this.props.footer() : this.renderButtons()))))];
    }

    renderButtons() {
      if (!this.props.buttons) {
        return null;
      }

      return this.props.buttons.map(buttonInfo => {
        return _h("button", {
          type: "button",
          className: "btn " + (buttonInfo.className || "btn-primary"),
          onClick: () => buttonInfo.onClick(),
          ...(buttonInfo.props || {})
        }, buttonInfo.label);
      });
    }

  }

  exports.default = Modal;
  Modal.propTypes = {
    noHeader: 'bool',
    noBackdrop: 'bool',
    noClose: 'bool',
    visible: 'bool',
    isExtraLarge: 'bool',
    backgroundImageRef: 'string',
    children: true
  };
};__mm["UI/Loading"] = function (global, exports) {
  function Loading(props) {
    let message = props.message || `Loading ... `;
    return _h("div", {
      className: "alert alert-info loading"
    }, message, _h("i", {
      className: "fas fa-spinner fa-spin"
    }));
  }

  exports.default = Loading;
};__mm["UI/Input/Radio"] = function (global, exports) {
  function Radio(props) {
    var {
      id,
      className,
      name,
      label,
      onClick,
      onChange,
      onBlur,
      invalid,
      checked,
      disabled,
      solid
    } = props;

    if (onClick && !onChange) {
      onChange = onClick;
    }

    className = className ? className.split(" ") : [];

    if (invalid) {
      className.push("is-invalid");
    }

    className.unshift("form-check");
    var radioClass = className.join(" ");
    var inputClass = "form-check-input" + (solid ? " form-check-input--solid" : "");
    return _h("div", {
      className: props.readonly ? '' : radioClass
    }, props.readonly ? (props.value === undefined ? props.defaultValue : props.value) ? _h("b", null, "Yes (readonly) ") : _h("b", null, "No (readonly) ") : _h("input", {
      class: inputClass,
      type: "radio",
      name: name,
      id: id,
      onChange: onChange,
      onBlur: onBlur,
      checked: checked ? "checked" : undefined,
      disabled: disabled ? "disabled" : undefined,
      value: props.value,
      defaultChecked: props.defaultValue
    }), _h("label", {
      class: "form-check-label",
      htmlFor: id
    }, label));
  }

  exports.default = Radio;
  Radio.propTypes = {};
  Radio.defaultProps = {};
  Radio.icon = 'dot-circle';
};__mm["UI/FileSelector/IconSelector"] = function (global, exports) {
  const Modal = _rq("UI/Modal").default;

  const Loop = _rq("UI/Loop").default;

  var faIconsRef = "s:ui/thirdparty/fileselector/iconselector/faicons.json";

  const Input = _rq("UI/Input").default;

  const Col = _rq("UI/Column").default;

  const Loading = _rq("UI/Loading").default;

  const Debounce = _rq("UI/Functions/Debounce").default;

  const webRequest = _rq("UI/Functions/WebRequest").default;

  const getRef = _rq("UI/Functions/GetRef").default;

  let icons = [];
  let iconStyles = [];
  let iconSets = [];

  class IconSelector extends React.Component {
    constructor(props) {
      super(props);
      this.search = this.search.bind(this);
      this.state = {
        selectIcon: false,
        selectedIcon: null,
        debounce: new Debounce(this.search)
      };
    }

    componentDidMount() {
      if (!icons.length) {
        var styles = [{
          name: `All`,
          key: 'all'
        }, {
          name: `Regular`,
          key: 'regular',
          prefix: 'far'
        }, {
          name: `Solid`,
          key: 'solid',
          prefix: 'fas'
        }, {
          name: `Brands`,
          key: 'brands',
          prefix: 'fab'
        }];
        var sets = [{
          name: `All`,
          key: 'all'
        }, {
          name: `Default (FontAwesome)`,
          key: 'default'
        }];
        var proms = [webRequest(getRef(faIconsRef, {
          url: true
        }))];

        if (global.customIcons) {
          global.customIcons.forEach(ci => {
            proms.push(webRequest(getRef(ci.listRef, {
              url: true
            })).then(response => {
              response.json.forEach(icon => {
                if (ci.prefix) {
                  icon.prefix = ci.prefix;
                }

                icon.set = ci.customSetName || 'custom';
              });
              sets.push({
                name: ci.customSetName || 'custom',
                key: ci.customSetName || 'custom'
              });
              return response;
            }));
          });
        }

        Promise.all(proms).then(responses => {
          icons = [];
          responses.forEach(r => icons = icons.concat(r.json));
          iconStyles = styles;
          iconSets = sets;
          this.setState({
            icons
          });
        });
      }
    }

    search(query) {
      console.log(query);
      this.setState({
        searchFilter: query.toLowerCase()
      });
    }

    closeModal() {
      this.props.onClose && this.props.onClose();
    }

    renderHeader() {
      return _h("div", {
        className: "row header-container"
      }, _h(Col, {
        size: 4
      }, _h("label", {
        htmlFor: "icon-style"
      }, `Style`), _h(Input, {
        type: "select",
        name: "icon-style",
        onChange: e => {
          this.setState({
            styleFilter: e.target.value
          });
        }
      }, iconStyles.map(s => _h("option", {
        value: s.key
      }, s.name)))), _h(Col, {
        size: 4
      }, _h("label", {
        htmlFor: "icon-set"
      }, `Set`), _h(Input, {
        type: "select",
        name: "icon-set",
        onChange: e => {
          this.setState({
            setFilter: e.target.value
          });
        }
      }, iconSets.map(s => _h("option", {
        value: s.key
      }, s.name)))), _h(Col, {
        size: 4
      }, _h("label", {
        htmlFor: "icon-search"
      }, `Search`), _h(Input, {
        type: "text",
        value: this.state.searchFilter,
        name: "icon-search",
        onKeyUp: e => {
          this.state.debounce.handle(e.target.value);
        }
      })));
    }

    render() {
      var {
        selectIcon,
        value,
        styleFilter,
        setFilter,
        searchFilter
      } = this.state;
      var prefixForStyle = {};
      iconStyles.forEach(s => {
        prefixForStyle[s.key] = s.prefix;
      });
      return this.props.visible ? _h("div", {
        className: "icon-selector"
      }, _h(Modal, {
        visible: true,
        onClose: () => this.closeModal(),
        isLarge: true,
        className: "icon-select-modal",
        title: `Select an icon`
      }, this.renderHeader(), _h("div", {
        className: "icon-container"
      }, _h(Loop, {
        raw: true,
        over: icons,
        orNone: () => _h(Loading, null)
      }, icon => {
        if (icon.name.toLowerCase().includes(searchFilter) || icon.name.toLowerCase().replace(/-/g, " ").includes(searchFilter) || !searchFilter) {
          return icon.styles.map(style => {
            if (styleFilter && styleFilter != "all") {
              if (styleFilter != style) {
                return null;
              }
            }

            if (setFilter && setFilter != "all") {
              if (setFilter == 'default') {
                if (icon.set) {
                  return null;
                }
              } else if (setFilter != icon.set) {
                return null;
              }
            }

            var prefix = prefixForStyle[style];
            var readableName = icon.name.replace(/-/g, " ");
            var styleClass = "icon-tile__style icon-tile__style--" + style.toLowerCase();
            return _h("button", {
              title: readableName,
              type: "button",
              className: "btn icon-tile",
              onClick: () => {
                var newIcon = prefix + ":" + (icon.prefix || "fa") + "-" + icon.name;
                this.setState({
                  value: newIcon
                });
                this.props.onSelected && this.props.onSelected(newIcon);
                this.closeModal && this.closeModal();
              }
            }, _h("div", {
              className: "icon-tile__preview"
            }, _h("i", {
              className: prefix + " " + (icon.prefix || "fa") + "-" + icon.name
            }), _h("span", {
              className: styleClass
            }, style)), _h("p", {
              className: "icon-tile__name"
            }, readableName));
          });
        }
      })))) : _h(React.Fragment, null);
    }

  }

  exports.default = IconSelector;
};__mm["UI/Functions/Omit"] = function (global, exports) {
  exports.default = function (object, keyOrKeys, noDefaults) {
    if (!object) {
      return object;
    }

    keyOrKeys = keyOrKeys instanceof Array ? keyOrKeys : [keyOrKeys];
    var result = {};

    for (var key in object) {
      if (!noDefaults) {
        if (key == 'children') {
          continue;
        }
      }

      if (keyOrKeys.indexOf(key) == -1) {
        result[key] = object[key];
      }
    }

    return result;
  };
};__mm["UI/PasswordReset"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  const Alert = _rq("UI/Alert").default;

  const Loading = _rq("UI/Loading").default;

  const Form = _rq("UI/Form").default;

  const Input = _rq("UI/Input").default;

  const {
    useSession,
    useRouter
  } = _rq("UI/Session");

  const useTokens = _rq("UI/Token").useTokens;

  function PasswordReset(props) {
    var {
      setPage
    } = useRouter();
    var {
      session,
      setSession
    } = useSession();
    var [loading, setLoading] = React.useState();
    var [failed, setFailed] = React.useState();
    var [policy, setPolicy] = React.useState();
    var token = useTokens('${url.token}');
    React.useEffect(() => {
      if (!token) {
        return;
      }

      setLoading(true);
      webRequest("passwordresetrequest/token/" + token + "/").then(response => {
        setLoading(false);
        setFailed(!response.json || !response.json.token);
      }).catch(e => {
        setFailed(true);
      });
    }, []);
    return _h("div", {
      className: "password-reset"
    }, this.state.failed ? _h(Alert, {
      type: "error"
    }, "Invalid or expired token. You'll need to request another one if this token is too old or was already used.") : this.state.loading ? _h("div", null, _h(Loading, null)) : _h(Form, {
      successMessage: "Password has been set.",
      failureMessage: "Unable to set your password. Your token may have expired.",
      submitLabel: "Set my password",
      action: "passwordresetrequest/login/" + token + "/",
      onSuccess: response => {
        setSession(response);

        if (props.onSuccess) {
          props.onSuccess(response);
        } else {
          setPage('/');
        }
      },
      onValues: v => {
        setPolicy(null);
        return v;
      },
      onFailed: e => {
        setPolicy(e);
      }
    }, _h(Input, {
      name: "password",
      type: "password",
      placeholder: "Your password"
    }), policy && _h(Alert, {
      type: "error"
    }, policy.message || 'Unable to set your password - the request may have expired')));
  }

  exports.default = PasswordReset;
  PasswordReset.propTypes = {
    token: 'string',
    target: 'string'
  };
};__mm["UI/Html"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Html(props) {
    return _h("span", {
      dangerouslySetInnerHTML: {
        __html: props.html || props.children
      },
      ...omit(props, ['html', 'children'])
    });
  }

  exports.default = Html;
  Html.propTypes = {
    html: 'text'
  };
};__mm["UI/Functions/HasCapability"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  var cache = null;

  exports.default = (capName, session) => {
    if (session.loadingUser) {
      return session.loadingUser.then(() => loadCached(capName, session));
    }

    return loadCached(capName, session);
  };

  function loadCached(capName, session) {
    if (cache != null) {
      return Promise.resolve(cache).then(caps => !!caps[capName]);
    }

    var roleId = session.user ? session.user.role : 0;
    return cache = webRequest("permission/role/" + roleId).then(response => {
      cache = {};
      response.json.capabilities.forEach(c => {
        cache[c.name] = c;
      });
      return cache;
    }).then(caps => !!caps[capName]);
  }
};__mm["UI/Alert"] = function (global, exports) {
  const useState = global.React.useState;

  const CloseButton = _rq("UI/CloseButton").default;

  const ALERT_PREFIX = 'alert';
  const DEFAULT_VARIANT = 'info';
  const supportedVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  const variantAliases = [{
    variant: 'primary',
    aliases: []
  }, {
    variant: 'secondary',
    aliases: []
  }, {
    variant: 'success',
    aliases: ['successful', 'ok', 'good']
  }, {
    variant: 'danger',
    aliases: ['fail', 'failed', 'failure', 'error']
  }, {
    variant: 'warning',
    aliases: ['warn']
  }, {
    variant: 'info',
    aliases: ['information', 'note']
  }, {
    variant: 'light',
    aliases: []
  }, {
    variant: 'dark',
    aliases: []
  }];

  function Alert(props) {
    const {
      children,
      variant,
      type,
      showIcon,
      icon,
      isDismissable
    } = props;
    const [showAlert, setShowAlert] = useState(true);
    var alertVariant, iconClass;

    if (type) {
      alertVariant = type.toLowerCase();
    } else {
      alertVariant = variant.toLowerCase();
    }

    if (!alertVariant) {
      alertVariant = DEFAULT_VARIANT;
    }

    var aliases = variantAliases.filter(i => i.aliases.includes(alertVariant));

    if (aliases.length) {
      alertVariant = aliases[0].variant;
    }

    if (!supportedVariants.includes(alertVariant)) {
      alertVariant = DEFAULT_VARIANT;
    }

    switch (alertVariant) {
      case 'success':
        iconClass = 'fal fa-check-circle';
        break;

      case 'danger':
        iconClass = 'fal fa-times-circle';
        break;

      case 'warning':
        iconClass = 'fal fa-exclamation-triangle';
        break;

      case 'info':
        iconClass = 'fal fa-info-circle';
        break;
    }

    if (icon) {
      iconClass = icon;
    }

    if (iconClass) {
      iconClass = ALERT_PREFIX + '__icon ' + iconClass;
    }

    var alertClass = [ALERT_PREFIX];
    alertClass.push(ALERT_PREFIX + '-' + alertVariant);

    if (isDismissable) {
      alertClass.push(ALERT_PREFIX + '-dismissable');
    }

    return _h(React.Fragment, null, showAlert && _h(React.Fragment, null, _h("div", {
      className: alertClass.join(' '),
      role: "alert"
    }, isDismissable && _h(React.Fragment, null, _h(CloseButton, {
      callback: () => setShowAlert(false)
    })), _h("div", {
      className: "alert__internal"
    }, showIcon && iconClass && _h("i", {
      className: iconClass
    }), _h("span", {
      className: "alert__content"
    }, children)))));
  }

  exports.default = Alert;
  Alert.propTypes = {
    variant: ['error', 'warning', 'success', 'info'],
    isDismissable: 'bool',
    showIcon: 'bool',
    icon: 'string'
  };
  Alert.defaultProps = {
    children: 'My New Alert',
    variant: DEFAULT_VARIANT,
    isDismissable: false,
    showIcon: true
  };
  Alert.icon = 'exclamation-circle';
};__mm["UI/ProjectSelect"] = function (global, exports) {
  const DirectorySelect = _rq("UI/DirectorySelect").default;

  const useProjectList = _rq("UI/ProjectList").useProjectList;

  const useRouter = _rq("UI/Session").useRouter;

  function ProjectSelect(props) {
    var {
      addProject
    } = useProjectList();
    var {
      setPage
    } = useRouter();
    return _h("div", {
      className: "project-select"
    }, _h(DirectorySelect, {
      label: `Browse for a Lumity project`,
      onSelect: dirPath => {
        var project = {
          directory: dirPath,
          name: 'Unnamed Project'
        };
        project = addProject(project);
        setPage('projects/' + project.id);
      }
    }));
  }

  exports.default = ProjectSelect;
};__mm["UI/Functions/GetContentTypeId"] = function (global, exports) {
  const _hash1 = (5381 << 16) + 5381 | 0;

  const floor = Math.floor;

  exports.default = function (typeName) {
    typeName = typeName.toLowerCase();
    var hash1 = _hash1;
    var hash2 = hash1;

    for (var i = 0; i < typeName.length; i += 2) {
      var s1 = ~~floor(hash1 << 5);
      hash1 = ~~floor(s1 + hash1);
      hash1 = hash1 ^ typeName.charCodeAt(i);
      if (i == typeName.length - 1) break;
      s1 = ~~floor(hash2 << 5);
      hash2 = ~~floor(s1 + hash2);
      hash2 = hash2 ^ typeName.charCodeAt(i + 1);
    }

    var result = ~~floor(Math.imul(hash2, 1566083941));
    result = ~~floor(hash1 + result);
    return result;
  };

  ;
};__mm["UI/Functions/GetBuildDate"] = function (global, exports) {
  var buildDate = null;

  exports.default = () => {
    if (!buildDate) {
      var scr = global.document.scripts;

      for (var i = 0; i < scr.length; i++) {
        var src = scr[i].src;

        if (!src || src.indexOf("pack/main.js?") == -1 || src.indexOf('en-admin/') != -1) {
          continue;
        }

        var versionParts = src.split('?');
        var vp = versionParts[1].split('&');
        var map = {};

        for (var n = 0; n < vp.length; n++) {
          var entry = vp[n].split('=');

          if (entry.length == 2) {
            map[entry[0]] = entry[1];
          }
        }

        var timestamp = parseInt(map['v']);
        var date = new Date(timestamp);
        buildDate = {
          date,
          hash: map['h'],
          dateString: date.toUTCString(),
          timestamp
        };
        break;
      }
    }

    return buildDate;
  };
};__mm["UI/Functions/GetContentTypes"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  var cache = null;

  exports.default = () => {
    if (cache != null) {
      return Promise.resolve(cache);
    }

    return cache = webRequest("autoform").then(response => {
      return cache = response.json.contentTypes;
    });
  };
};__mm["UI/Canvas"] = function (global, exports) {
  const expand = _rq("UI/Functions/CanvasExpand").expand;

  const RouterConsumer = _rq("UI/Session").RouterConsumer;

  const Alert = _rq("UI/Alert").default;

  var uniqueKey = 1;

  class Canvas extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        content: this.loadJson(props)
      };
    }

    componentWillReceiveProps(props) {
      var dataSource = props.bodyJson || props.children;

      if (this.props) {
        var prevDataSource = this.props.bodyJson || this.props.children;

        if (typeof dataSource == 'string' && prevDataSource == dataSource) {
          return;
        }
      }

      this.setState({
        content: this.loadJson(props)
      });
    }

    loadJson(props, set) {
      var content;
      var dataSource = props.bodyJson || props.children;

      if (typeof dataSource == 'string') {
        try {
          content = JSON.parse(dataSource);
        } catch (e) {
          console.log("Canvas failed to load JSON: ", dataSource);
          console.error(e);
        }
      } else {
        content = dataSource;
      }

      if (content) {
        content = expand(content, props.onContentNode);
      }

      return content;
    }

    forceRender() {
      this.setState({
        content: this.state.content
      });
    }

    onChange() {
      this.forceRender();
      this.props.onCanvasChanged && this.props.onCanvasChanged();
    }

    renderNodeC1(contentNode, index, pageRouter) {
      if (!contentNode) {
        return null;
      }

      if (!contentNode.module && !contentNode.content) {
        return contentNode;
      }

      var Module = contentNode.module || "div";
      var dataFields = contentNode.data;
      return _h(Module, {
        key: index,
        ...dataFields
      }, contentNode.useCanvasRender && contentNode.content ? contentNode.content.map((e, i) => this.renderNodeC1(e, i, pageRouter)) : contentNode.content);
    }

    renderNode(node) {
      if (!node) {
        return null;
      }

      if (Array.isArray(node)) {
        return node.map((n, i) => {
          if (n && !n.__key) {
            if (n.id) {
              n.__key = n.id;
            } else {
              n.__key = "_canvas_" + uniqueKey;
            }

            uniqueKey++;
          }

          return this.renderNode(n);
        });
      }

      var NodeType = node.type;

      if (NodeType == '#text') {
        return node.text;
      } else if (typeof NodeType === 'string') {
        if (!node.dom) {
          node.dom = React.createRef();
        }

        var childContent = null;

        if (node.content && node.content.length) {
          childContent = this.renderNode(node.content);
        } else if (!node.isInline && node.type != 'br') {
          childContent = this.renderNode({
            type: 'br',
            props: {
              'rte-fake': 1
            }
          });
        }

        return _h(NodeType, {
          key: node.__key,
          ref: node.dom,
          ...node.props
        }, childContent);
      } else if (NodeType) {
        var props = { ...node.props
        };

        if (node.roots) {
          var children = null;

          for (var k in node.roots) {
            var root = node.roots[k];
            var isChildren = k == 'children';
            var rendered = this.renderNode(root.content);

            if (isChildren) {
              children = rendered;
            } else {
              props[k] = rendered;
            }
          }

          return _h(ErrorCatcher, {
            node: node
          }, _h(NodeType, {
            key: node.__key,
            ...props
          }, children));
        } else {
          return _h(ErrorCatcher, {
            node: node
          }, _h(NodeType, {
            key: node.__key,
            ...props
          }));
        }
      } else if (node.content) {
        return this.renderNode(node.content);
      }
    }

    render() {
      var content = this.state.content;

      if (!content) {
        return null;
      }

      return _h(RouterConsumer, null, pageRouter => {
        if (content.c2) {
          return this.renderNode(content, 0, pageRouter);
        } else {
          return Array.isArray(content) ? content.map((e, i) => this.renderNodeC1(e, i, pageRouter)) : this.renderNodeC1(content, 0, pageRouter);
        }
      });
    }

  }

  exports.default = Canvas;

  class ErrorCatcher extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false
      };
    }

    static getDerivedStateFromError(error) {
      return {
        hasError: true
      };
    }

    componentDidCatch(error, errorInfo) {
      console.error(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        var {
          node
        } = this.props;
        var name = node ? node.typeName : 'Unknown';
        return _h(Alert, {
          type: "error"
        }, `The component "${name}" has unfortunately crashed. The error it had has been logged to the console.`);
      }

      return this.props.children;
    }

  }

  exports.ErrorCatcher = ErrorCatcher;
};__mm["UI/User/ForgotPassword"] = function (global, exports) {
  const Input = _rq("UI/Input").default;

  const Form = _rq("UI/Form").default;

  class ForgotPassword extends React.Component {
    render() {
      return _h("div", {
        className: "forgot-password"
      }, this.state.success ? _h("div", null, this.props.successMessage || `Your request has been submitted - if an account exists with this email address it will receive an email shortly.`) : [_h("p", null, this.props.prompt || `Please provide your email address and we'll email you a reset link.`), _h(Form, {
        failedMessage: this.props.failedMessage || `We weren't able to send the link. Please try again later.`,
        submitLabel: this.props.submitLabel || `Send me a link`,
        loadingMessage: this.props.loadingMessage || `Sending..`,
        action: "passwordresetrequest",
        onSuccess: response => {
          this.setState({
            success: true
          });
          this.props.onSuccess && this.props.onSuccess();
        }
      }, _h(Input, {
        name: "email",
        placeholder: `Email address`,
        validate: "Required"
      }))], this.props.children || _h("div", {
        className: "form-group"
      }, _h("a", {
        className: "btn btn-outline-primary",
        href: this.props.loginLink || "/login"
      }, `Back to login`)));
    }

  }

  exports.default = ForgotPassword;
  ForgotPassword.propTypes = {};
};__mm["UI/Heading"] = function (global, exports) {
  const omit = _rq("UI/Functions/Omit").default;

  function Heading(props) {
    const {
      size,
      className,
      children,
      animation,
      animationDirection
    } = props;
    var Mod = 'h' + (size || '1');
    var headerClass = 'heading ' + (className || '');
    var anim = animation ? animation : undefined;

    switch (anim) {
      case 'fade':
      case 'zoom-in':
      case 'zoom-out':
        if (animationDirection) {
          anim += "-" + animationDirection;
        }

        break;

      case 'flip':
      case 'slide':
        if (animationDirection) {
          anim += "-" + animationDirection;
        } else {
          anim += "-up";
        }

        break;
    }

    return _h(Mod, {
      className: headerClass,
      "data-aos": anim,
      ...omit(props, ['size', 'children', 'className', 'animation', 'animationDirection'])
    }, children);
  }

  exports.default = Heading;
  Heading.propTypes = {
    size: ['1', '2', '3', '4', '5', '6'],
    children: {
      default: 'My New Heading'
    },
    className: 'string',
    animation: [{
      name: 'None',
      value: null
    }, {
      name: 'Fade',
      value: 'fade'
    }, {
      name: 'Flip',
      value: 'flip'
    }, {
      name: 'Slide',
      value: 'slide'
    }, {
      name: 'Zoom in',
      value: 'zoom-in'
    }, {
      name: 'Zoom out',
      value: 'zoom-out'
    }],
    animationDirection: [{
      name: 'Static',
      value: null
    }, {
      name: 'Up',
      value: 'up'
    }, {
      name: 'Down',
      value: 'down'
    }, {
      name: 'Left',
      value: 'left'
    }, {
      name: 'Right',
      value: 'right'
    }]
  };
  Heading.defaultProps = {
    animation: 'none',
    animationDirection: 'static'
  };
  Heading.icon = 'heading';
};__mm["UI/Functions/GetDateRange"] = function (global, exports) {
  function getDateRange(range) {
    var now = Date.now();
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    switch (range) {
      case "Today":
        return oneDay(now);

      case "Tomorrow":
        var tomorrow = now + 86400000;
        return oneDay(tomorrow);

      case "This Weekend":
        day = new Date(now);
        weekDay = day.getUTCDay();

        if (0 > weekDay < 5) {
          var daysTillFriday = 5 - weekDay;
          var rangeBegin = now + 86400000 * daysTillFriday;
          var rangeEnd = now + 86400000 * (daysTillFriday + 2);
          return dateRange(rangeBegin, rangeEnd);
        } else if (weekDay == 0) {
            return oneDay(now);
          } else {
              var daysLeft = 7 - weekday;
              var rangeEnd = now + 86400000 * daysLeft;
              return dateRange(now, rangeEnd);
            }

      case "This Week":
        var weekFromNow = now + 86400000 * 7;
        return dateRange(now, weekFromNow);

      case "Next Week":
        var weekFromNow = now + 86400000 * 7;
        var twoWeeksFromNow = now + 86400000 * 14;
        return dateRange(weekFromNow, twoWeeksFromNow);

      case "This Month":
        var date = new Date(now);
        var month = date.getMonth();
        var isLeapYear = false;

        if (date.getUTCFullYear() % 4 == 0) {
          isLeapYear = true;
        }

        var daysLeft = daysInMonth[month] - date.getUTCDay();

        if (isLeapYear && month == 1) {
          daysLeft += 1;
        }

        if (daysLeft <= 5) {
          var daysTillEndOfNextMonth = dayLeft + daysInMonth[month + 1];

          if (isLeapYear && month + 1 == 1) {
            daysTillEndOfNextMonth += 1;
          }

          var rangeEnd = now + 86400000 * daysTillEndOfNextMonth;
        } else {
          var rangeEnd = now + 86400000 * daysLeft;
        }

        return dateRange(now, rangeEnd);

      default:
        return undefined;
    }

    function oneDay(begin) {
      var rangeBegin = new Date(begin).toISOString();
      return [[{
        StartUtc: rangeBegin,
        op: '<='
      }, 'and', {
        EndUtc: rangeBegin,
        op: '>='
      }]];
    }

    function dateRange(begin, end) {
      var rangeBegin = new Date(begin).toISOString();
      var rangeEnd = new Date(end).toISOString();
      return [[{
        StartUtc: rangeBegin,
        op: '>='
      }, 'and', {
        EndUtc: rangeBegin,
        op: '<='
      }], 'or', [{
        StartUtc: rangeEnd,
        op: '>='
      }, 'and', {
        EndUtc: rangeEnd,
        op: '<='
      }]];
    }
  }

  exports.default = getDateRange;
};__mm["UI/Token"] = function (global, exports) {
  const {
    useSession,
    useRouter
  } = _rq("UI/Session");

  const useContent = _rq("UI/Content").useContent;

  var modes = {
    'content': 1,
    'session': 1,
    'url': 1,
    'customdata': 1,
    'primary': 1,
    'theme': 1
  };

  function TokenResolver(props) {
    return props.children(useTokens(props.value));
  }

  exports.TokenResolver = TokenResolver;

  function useTokens(str) {
    var {
      session
    } = useSession();
    var localContent = useContent();
    var {
      pageState
    } = useRouter();
    return (str || '').toString().replace(/\$\{(\w|\.)+\}/g, function (textToken) {
      var fields = textToken.substring(2, textToken.length - 1).split('.');
      var mode = '';
      var first = fields[0].toLowerCase();

      if (modes[first]) {
        fields.shift();
        mode = first;
      }

      return resolveValue(mode, fields, session, localContent, pageState);
    });
  }

  exports.useTokens = useTokens;

  function resolveValue(mode, fields, session, localContent, pageState) {
    var token;

    if (mode == "content") {
      token = localContent ? localContent.content : null;
    } else if (mode == "url") {
      if (!pageState || !pageState.tokenNames) {
        return '';
      }

      var index = pageState.tokenNames.indexOf(fields.join('.'));
      return index == null || index == -1 ? '' : pageState.tokens[index];
    } else if (mode == "theme") {
      return 'var(--' + fields.join('-') + ')';
    } else if (mode == "customdata" || mode == "primary") {
      if (!pageState || !pageState.po) {
        return '';
      }

      token = pageState.po;
    } else {
      token = session;
    }

    if (!token) {
      return '';
    }

    var fields = fields;

    if (Array.isArray(fields) && fields.length) {
      try {
        for (var i = 0; i < fields.length; i++) {
          token = token[fields[i]];

          if (token === undefined || token === null) {
            return '';
          }
        }
      } catch (e) {
        console.log(e);
        token = null;
      }

      return token;
    } else if (typeof fields == 'string') {
      return token[fields];
    }
  }

  exports.resolveValue = resolveValue;

  function Token(props) {
    var {
      session
    } = useSession();
    var localContent = useContent();
    var {
      pageState
    } = useRouter();

    if (props._rte) {
      return _h("span", {
        className: "context-token",
        ref: props.rootRef
      }, props.children);
    }

    return resolveValue(props.mode, props.fields, session, localContent, pageState);
  }

  exports.default = Token;
  Token.editable = {
    inline: true,
    onLoad: nodeInfo => {
      const data = nodeInfo.d || {};
      let str = data.mode || '';
      let fieldStr = data.fields ? data.fields.join('.') : '';

      if (str && fieldStr) {
        str += '.' + fieldStr;
      } else {
        str += fieldStr;
      }

      if (!str) {
        str = 'unnamed token';
      }

      nodeInfo.r = {
        children: {
          s: str
        }
      };
      nodeInfo.d = null;
    },
    onSave: nodeInfo => {
      var childRoot = nodeInfo.c && typeof nodeInfo.c === 'string';

      if (nodeInfo.c && typeof nodeInfo.c === 'string') {
        var pieces = nodeInfo.c.split('.');
        var first = pieces[0].toLowerCase();
        nodeInfo.d = {};

        if (modes[first]) {
          nodeInfo.d.mode = first;
          pieces.shift();
        }

        nodeInfo.d.fields = pieces;
        delete nodeInfo.c;
      }
    }
  };
  Token.propTypes = {
    children: 'jsx'
  };
};__mm["UI/BootstrapButton"] = function (global, exports) {
  function plainLabel(jsx) {
    var div = document.createElement("div");
    div.innerHTML = jsx;
    return div.textContent || div.innerText || "";
  }

  function Button(props) {
    var {
      children,
      id,
      className,
      tag,
      buttonType,
      href,
      onClick,
      disabled,
      variant,
      outlined,
      noWrap,
      sm,
      lg
    } = props;
    className = className ? className.split(" ") : [];
    var Tag = tag ? tag : "button";

    switch (Tag) {
      case 'button':
      case 'a':
      case 'input':
        break;

      default:
        Tag = "button";
        break;
    }

    if (href) {
      Tag = "a";
    }

    if (!buttonType) {
      buttonType = "button";
    }

    switch (buttonType) {
      case 'button':
      case 'submit':
      case 'reset':
        break;

      default:
        buttonType = "button";
        break;
    }

    if (!variant) {
      variant = "primary";
    }

    if (noWrap) {
      className.unshift("text-nowrap");
    }

    if (disabled) {
      className.unshift("disabled");
    }

    if (sm) {
      className.unshift("btn-sm");
    }

    if (lg) {
      className.unshift("btn-lg");
    }

    className.unshift("btn-" + (outlined ? "outline-" : "") + variant);
    className.unshift("btn");
    var btnClass = className.join(" ");
    return _h(Tag, {
      className: btnClass,
      onClick: onClick,
      id: id,
      disabled: Tag != "a" && disabled ? "disabled" : undefined,
      "aria-disabled": disabled ? "true" : undefined,
      tabindex: disabled ? "-1" : undefined,
      href: Tag == "a" ? href : undefined,
      type: Tag == "a" ? undefined : buttonType,
      role: Tag == "a" ? "button" : undefined,
      value: Tag == "input" ? plainLabel(children) : undefined
    }, children);
  }

  exports.default = Button;
  Button.propTypes = {};
  Button.defaultProps = {};
  Button.icon = 'keyboard';
};__mm["UI/ProjectView"] = function (global, exports) {
  const useProjectList = _rq("UI/ProjectList").useProjectList;

  const useRouter = _rq("UI/Session").useRouter;

  const PageWithSidebar = _rq("UI/PageWithSidebar").default;

  const Alert = _rq("UI/Alert").default;

  const TransactionList = _rq("UI/Transaction/List").default;

  function ProjectView(props) {
    var {
      pageState
    } = useRouter();
    var {
      projectList
    } = useProjectList();

    if (!pageState || !pageState.tokens || !pageState.tokens.length) {
      return _h(Alert, {
        type: "error"
      }, `No project ID provided. The url must be /project/{number_here}`);
    }

    var id = parseInt(pageState.tokens[0]);

    if (!id) {
      return _h(Alert, {
        type: "error"
      }, `Provided project ID must be numeric.`);
    }

    var project = projectList.find(proj => proj.id == id);

    if (!project) {
      return _h(Alert, {
        type: "error"
      }, `Project with ID ${id} doesn't exist in your local storage.`);
    }

    var sidebar = _h(React.Fragment, null, project.name);

    return _h(PageWithSidebar, {
      sidebar: sidebar
    }, _h(TransactionList, {
      project: project
    }));
  }

  exports.default = ProjectView;
};__mm["UI/CloseButton"] = function (global, exports) {
  const CLOSE_PREFIX = 'btn-close';

  function CloseButton(props) {
    var {
      isDisabled,
      isLight,
      label,
      callback
    } = props;
    var btnCloseClass = [CLOSE_PREFIX];

    if (isLight) {
      btnCloseClass.push(CLOSE_PREFIX + '-white');
    }

    label = label || `Close`;
    return _h(React.Fragment, null, _h("button", {
      type: "button",
      className: btnCloseClass.join(' '),
      disabled: isDisabled ? true : undefined,
      "aria-label": label,
      onClick: callback
    }));
  }

  exports.default = CloseButton;
  CloseButton.propTypes = {
    isDisabled: 'bool',
    isLight: 'bool',
    label: 'string'
  };
  CloseButton.defaultProps = {
    isDisabled: false,
    isLight: false
  };
  CloseButton.icon = 'times';
};__mm["UI/Functions/GetEndpointType"] = function (global, exports) {
  const isNumeric = _rq("UI/Functions/IsNumeric").default;

  function GetEndpointType(ep) {
    var parts = ep.split('v1/');

    if (parts.length == 2) {
      ep = parts[1];
    }

    if (ep[ep.length - 1] == '/') {
      ep = ep.substring(0, ep.length - 1);
    }

    if (ep[0] == '/') {
      ep = ep.substring(1);
    }

    parts = ep.split('/');
    var last = parts[parts.length - 1];
    var isUpdate = isNumeric(last);
    var isList = last == 'list';

    if (isList || isUpdate) {
      parts.pop();
    }

    return {
      type: parts.join('/'),
      isUpdate,
      updatingId: isUpdate ? parseInt(last) : undefined,
      isList
    };
  }

  exports.default = GetEndpointType;
};__mm["UI/Collapsible"] = function (global, exports) {
  function Collapsible(props) {
    var isOpen = props && props.open;
    var noContent = !props.children;
    var expanderLeft = props.expanderLeft;
    var hasButtons = props.buttons && props.buttons.length;

    if (noContent) {
      isOpen = false;
    }

    var detailsClass = isOpen ? "collapsible open" : "collapsible";
    var summaryClass = noContent ? "collapsible-summary no-content" : "collapsible-summary";
    var iconClass = expanderLeft || hasButtons ? "collapsible-icon collapsible-icon-left" : "collapsible-icon";

    if (noContent) {
      iconClass += " invisible";
    }

    return _h("details", {
      className: detailsClass,
      open: isOpen,
      onClick: noContent ? e => {
        e.preventDefault();
      } : false
    }, _h("summary", {
      className: summaryClass
    }, (expanderLeft || hasButtons) && _h("div", {
      className: iconClass
    }, _h("i", {
      className: "far fa-fw"
    })), _h("h4", {
      className: "collapsible-title"
    }, props.title, props.subtitle && _h("small", null, props.subtitle)), !expanderLeft && !hasButtons && _h("div", {
      className: iconClass
    }, _h("i", {
      className: "far fa-chevron-down"
    })), hasButtons && _h("div", {
      className: "buttons"
    }, props.buttons.map(button => {
      return _h("button", {
        type: "button",
        className: "btn btn-sm btn-outline-primary",
        onClick: button.onClick,
        title: button.text
      }, _h("i", {
        className: button.icon
      }), _h("span", {
        className: "sr-only"
      }, button.text));
    }))), !noContent && _h("div", {
      className: "collapsible-content"
    }, props.children));
  }

  exports.default = Collapsible;
};__mm["UI/Functions/WebRequest"] = function (global, exports) {
  const store = _rq("UI/Functions/Store").default;

  const contentChange = _rq("UI/Functions/ContentChange").default;

  function expandIncludes(response) {
    if (!response || !response.result && !response.results) {
      return response;
    }

    var {
      result,
      results,
      includes
    } = response;

    if (includes) {
      for (var i = includes.length - 1; i >= 0; i--) {
        var inc = includes[i];
        var targetValues = inc.on === undefined ? results || [result] : includes[inc.on].values;

        if (inc.src) {
          var byIdMap = {};
          inc.values.forEach(v => byIdMap[v.id] = v);
          targetValues.forEach(val => {
            val[inc.field] = byIdMap[val[inc.src]];
          });
        } else if (typeof inc.map == 'string') {
          var targetIdMap = {};
          targetValues.forEach(v => {
            targetIdMap[v.id] = v;
            v[inc.field] = [];
          });
          inc.values.forEach(v => {
            var target = targetIdMap[v[inc.map]];

            if (target) {
              target[inc.field].push(v);
            }
          });
        } else if (inc.map) {
          var srcIdMap = {};
          targetValues.forEach(v => {
            srcIdMap[v.id] = v;
            v[inc.field] = [];
          });
          var targetIdMap = {};
          inc.values.forEach(v => targetIdMap[v.id] = v);

          for (var n = 0; n < inc.map.length; n += 3) {
            var id = inc.map[n];
            var a = srcIdMap[inc.map[n + 1]];
            var b = targetIdMap[inc.map[n + 2]];

            if (a && b) {
              a[inc.field].push(b);
            }
          }
        }
      }
    }

    return response.result ? response.result : response;
  }

  exports.expandIncludes = expandIncludes;

  function mapWhere(where, args) {
    var str = '';

    if (Array.isArray(where)) {
      for (var i = 0; i < where.length; i++) {
        if (str) {
          str += where[i].and ? ' and ' : ' or ';
        }

        str += '(' + mapWhere(where[i], args) + ')';
      }
    } else {
      for (var k in where) {
        if (k == 'and' || k == 'op') {
          continue;
        }

        var v = where[k];

        if (v === undefined) {
          continue;
        }

        if (str != '') {
          str += ' and ';
        }

        if (Array.isArray(v)) {
          str += k + ' contains [?]';
          args.push(v);
        } else if (v !== null && typeof v === 'object') {
          for (var f in v) {
            switch (f) {
              case "startsWith":
                str += k + " sw ?";
                args.push(v[f]);
                break;

              case "contains":
                str += k + " contains " + (Array.isArray(v[f]) ? '[?]' : '?');
                args.push(v[f]);
                break;

              case "containsNone":
              case "containsAny":
              case "containsAll":
                str += k + " " + f + " [?]";
                args.push(v[f]);
                break;

              case "endsWith":
                str += k + " endsWith ?";
                args.push(v[f]);
                break;

              case "geq":
              case "greaterThanOrEqual":
                str += k + ">=?";
                args.push(v[f]);
                break;

              case "greaterThan":
                str += k + ">?";
                args.push(v[f]);
                break;

              case "lessThan":
                str += k + "<?";
                args.push(v[f]);
                break;

              case "leq":
              case "lessThanOrEqual":
                str += k + "<=?";
                args.push(v[f]);
                break;

              case "not":
                str += k + "!=" + (Array.isArray(v[f]) ? '[?]' : '?');
                args.push(v[f]);
                break;

              case "name":
              case "equals":
                str += k + "=" + (Array.isArray(v[f]) ? '[?]' : '?');
                args.push(v[f]);
                break;

              default:
                break;
            }
          }
        } else {
          str += k + '=?';
          args.push(v);
        }
      }
    }

    return str;
  }

  const _lazyCache = {};

  function lazyLoad(url) {
    var entry = _lazyCache[url];

    if (!entry) {
      entry = webRequest(url, null, {
        rawText: 1
      }).then(resp => {
        var js = resp.text;

        try {
          _lazyCache[url] = eval('var ex={};(function(global,exports){' + js + '})(global,ex);Promise.resolve(ex);');
        } catch (e) {
          console.log(e);
        }

        return _lazyCache[url];
      });
      _lazyCache[url] = entry;
    }

    return entry;
  }

  exports.expandIncludes = expandIncludes;
  exports.lazyLoad = lazyLoad;

  function webRequest(origUrl, data, opts) {
    var apiUrl = global.apiHost || '';

    if (!apiUrl.endsWith('/')) {
      apiUrl += '/';
    }

    apiUrl += 'v1/';
    var url = origUrl.indexOf('http') === 0 || origUrl[0] == '/' ? origUrl : apiUrl + origUrl;
    return new Promise((success, reject) => {
      _fetch(url, data, opts).then(response => {
        if (global.storedToken && response.headers) {
          var token = response.headers.get('Token');

          if (token) {
            store.set('context', token);
          }
        }

        if (opts && opts.blob) {
          return response.blob().then(blob => {
            if (!response.ok) {
              return reject({
                error: 'invalid response',
                blob
              });
            }

            response.json = response.blob = blob;
            success(response);
          });
        }

        if (opts && opts.rawText) {
          return response.text().then(text => {
            if (!response.ok) {
              return reject({
                error: 'invalid response',
                text
              });
            }

            response.json = response.text = text;
            success(response);
          });
        }

        return response.text().then(text => {
          let json;

          try {
            json = text && text.length ? JSON.parse(text) : null;
          } catch (e) {
            console.log(url, e);
            reject({
              error: 'invalid/json',
              text
            });
            return;
          }

          if (!response.ok) {
            reject(json || {
              error: 'invalid response'
            });
            return;
          }

          response.json = expandIncludes(json);
          var method = 'get';

          if (opts && opts.method) {
            method = opts.method.toLowerCase();
          } else if (data) {
            method = 'post';
          }

          success(response);

          if (response.json && response.json.id && response.json.type && method != 'get') {
            contentChange(response.json, origUrl, method == 'delete' ? {
              deleted: true
            } : null);
          }
        }).catch(err => {
          console.log(err);
          reject(err);
        });
      }).catch(err => {
        console.log(err);
        reject(err);
      });
    });
  }

  exports.default = webRequest;

  function remapData(data, origUrl) {
    if (data.where) {
      var where = data.where;
      var d2 = { ...data
      };
      delete d2.where;
      var args = [];
      var str = '';

      if (where.from && where.from.type && where.from.id) {
        str = 'From(' + where.from.type + ',?,' + where.from.map + ')';
        args.push(where.from.id);
        delete where.from;
      } else {
        str = '';
      }

      var q = mapWhere(where, args);

      if (q) {
        if (str) {
          str += ' and ' + q;
        } else {
          str = q;
        }
      }

      d2.query = str;
      d2.args = args;
      data = d2;
    }

    if (data.on && data.on.type && data.on.id && origUrl.endsWith("/list")) {
      var on = data.on;
      var d2 = { ...data
      };
      delete d2.on;
      var onStatement = 'On(' + data.on.type + ',?' + (data.on.map ? ',"' + data.on.map + '"' : '') + ')';

      if (d2.query) {
        d2.query = '(' + d2.query + ') and ' + onStatement;
      } else {
        d2.query = onStatement;
      }

      if (!d2.args) {
        d2.args = [];
      }

      d2.args.push(data.on.id);
      data = d2;
    }

    return data;
  }

  exports.remapData = remapData;

  function _fetch(url, data, opts) {
    var origUrl = url;
    var credentials = undefined;
    var mode = 'cors';
    var headers = opts ? opts.headers || {} : {};
    var toOrigin = true;

    if (url.indexOf('http') === 0) {
      if (!(opts && opts.toOrigin || global.apiHost && url.indexOf(global.apiHost) === 0 || url.indexOf(location.origin) === 0)) {
        toOrigin = false;
      }
    }

    if (toOrigin) {
      if (global.settings && global.settings._version_) {
        headers.Version = global.settings._version_;
      }

      if (global.storedToken) {
        headers['Token'] = global.storedTokenValue || store.get('context');
      }

      if (opts && opts.locale) {
        headers['Locale'] = opts.locale;
      }

      credentials = global.storedToken ? undefined : 'include';
    }

    var includes = opts && opts.includes;

    if (Array.isArray(includes)) {
      includes = includes.map(x => x.trim()).join(',');
    }

    if (includes) {
      url += '?includes=' + includes;
    }

    if (!data) {
      return fetch(url, {
        method: opts && opts.method ? opts.method : 'get',
        mode,
        credentials,
        headers
      });
    }

    if (global.FormData && data instanceof global.FormData) {
      return fetch(url, {
        method: opts && opts.method ? opts.method : 'post',
        body: data,
        mode,
        credentials,
        headers
      });
    }

    data = remapData(data, origUrl);
    return fetch(url, {
      method: opts && opts.method ? opts.method : 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers
      },
      mode,
      body: JSON.stringify(data),
      credentials
    });
  }
};__mm["UI/Loop"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  const Column = _rq("UI/Column").default;

  const Row = _rq("UI/Row").default;

  const Content = _rq("UI/Content").default;

  const webSocket = _rq("UI/Functions/WebSocket").default;

  const getEndpointType = _rq("UI/Functions/GetEndpointType").default;

  const Failure = _rq("UI/Failed").default;

  const Paginator = _rq("UI/Paginator").default;

  const isoConvert = _rq("UI/Functions/DateTools").isoConvert;

  const DEFAULT_PAGE_SIZE = 50;
  const filterOperators = {
    "startsWith": (a, b) => a && a.indexOf(b) == 0,
    "contains": (a, b) => a && a.indexOf(b) != -1,
    "endsWith": (a, b) => a && a.substring(a.length - b.length, a.length) === b,
    "geq": (a, b) => a >= b,
    "greaterThanOrEqual": (a, b) => a >= b,
    "greaterThan": (a, b) => a > b,
    "lessThan": (a, b) => a < b,
    "leq": (a, b) => a <= b,
    "lessThanOrEqual": (a, b) => a <= b,
    "not": (a, b) => a != b,
    "equals": (a, b) => a == b
  };

  class Loop extends React.Component {
    constructor(props) {
      super(props);

      if (Array.isArray(props.over)) {
        this.state = this.loadDirectArray(props, 1);
      } else if (typeof props.over === 'string') {
        var firstSlash = props.over.indexOf('/');
        var cached;

        if (firstSlash == -1 || props.over.substring(firstSlash + 1) == 'list') {
          cached = Content.listCached(firstSlash == -1 ? props.over : props.over.substring(0, firstSlash), props.filter, props.includes);
        }

        if (cached) {
          if (cached.then) {
            cached = cached.then(r => {
              this.state = this.processCached(r, props);
            });
            this.state = {
              cached
            };
          } else {
            this.state = this.processCached(cached, props);
          }
        } else {
          this.state = {
            pageIndex: 1
          };
        }
      } else {}

      this.onLiveMessage = this.onLiveMessage.bind(this);
      this.onContentChange = this.onContentChange.bind(this);
    }

    processCached(pending, props) {
      var results = pending && pending.results ? pending.results : [];

      if (props.onResults) {
        results = props.onResults(results);
      }

      if (props.reverse) {
        results = results.reverse();
      }

      return {
        results,
        errored: false,
        totalResults: pending.total
      };
    }

    componentWillMount() {
      var {
        _pending
      } = this.state;
      var props = this.props;

      if (_pending) {}
    }

    onLiveMessage(msg) {
      if (msg.all) {
        if (msg.type == "status") {
          if (msg.connected) {
            this.load(this.props);
          }

          this.props.onLiveStatus && this.props.onLiveStatus(msg.connected);
        }

        return;
      }

      if (this.state.results && msg.entity) {
        var e = msg.entity;
        var entityId = e.id;

        if (msg.method == 'delete') {
          this.setState({
            results: this.state.results.filter(ent => ent && ent.id != entityId)
          });
        } else if (msg.method == 'update') {
          var res = this.state.results;
          var found = false;

          for (var i = 0; i < res.length; i++) {
            if (!res[i]) {
              continue;
            }

            if (res[i].id == entityId) {
              res[i] = e;
              found = true;
            }
          }

          if (found) {
            var keep = this.testFilter(e);

            if (keep && !this.isSorted()) {
              this.setState({
                results: res
              });
            } else {
              res = res.filter(ent => ent && ent.id != entityId);

              if (keep) {
                this.add(e, res, msg);
              } else {
                this.setState({
                  results: res
                });
              }
            }
          } else {
            if (this.testFilter(e)) {
              this.add(e, res, msg);
            }
          }
        } else if (msg.method == 'create') {
          var results = this.state.results;

          if (!results.find(ent => ent && ent.id == entityId)) {
            if (this.testFilter(msg.entity)) {
              this.add(msg.entity, results, msg);
            }
          }
        }
      }
    }

    sortedSearch(arr, item, compare, low, high) {
      if (high <= low) {
        return compare(item, arr[low]) == 1 ? low + 1 : low;
      }

      var mid = (low + high) / 2 | 0;

      if (compare(item, arr[mid]) == 0) {
        return mid + 1;
      }

      if (compare(item, arr[mid]) == 1) {
        return this.sortedSearch(arr, item, compare, mid + 1, high);
      }

      return this.sortedSearch(arr, item, compare, low, mid - 1);
    }

    isSorted() {
      var {
        filter
      } = this.props;
      return filter && filter.sort && filter.sort.field;
    }

    add(entity, results, msg) {
      var {
        filter,
        reverse
      } = this.props;

      if (results.length && this.isSorted()) {
        var desc = (filter.sort.dir || filter.sort.direction) == 'desc';

        if (reverse) {
          desc = !desc;
        }

        var positive = desc ? -1 : 1;
        var negative = -positive;
        var fieldName = filter.sort.field;
        fieldName = fieldName.charAt(0).toLowerCase() + fieldName.slice(1);
        var fieldValue = entity[fieldName];
        var isDate = fieldName.endsWith('Utc');

        if (isDate) {
          if (fieldValue) {
            fieldValue = isoConvert(fieldValue);

            if (fieldValue) {
              fieldValue = fieldValue.getTime();
            }
          } else {
            fieldValue = null;
          }
        }

        var targetIndex = this.sortedSearch(results, fieldValue, (a, b) => {
          var bField = b ? b[fieldName] : null;

          if (isDate) {
            if (typeof bField == 'string') {
              bField = isoConvert(bField);

              if (bField) {
                bField = bField.getTime();
              }
            } else if (bField && bField.getTime) {
              bField = bField.getTime();
            } else {
              bField = isoConvert(bField);

              if (bField) {
                bField = bField.getTime();
              }
            }
          }

          if (a > bField) {
            return positive;
          }

          return a == bField ? 0 : negative;
        }, 0, results.length - 1);
        results.splice(targetIndex, 0, entity);
      } else {
        results.push(entity);
      }

      this.props.onLiveCreate && this.props.onLiveCreate(entity, msg);
      this.setState({
        results
      });
    }

    testFilter(ent) {
      var {
        filter
      } = this.props;

      if (filter && filter.where) {
        var w = filter.where;

        if (Array.isArray(w)) {
          if (!w.length) {
            return true;
          }

          for (var i = 0; i < w.length; i++) {
            if (this.testFilterObj(ent, w[i])) {
              return true;
            }
          }

          return false;
        } else {
          if (!this.testFilterObj(ent, w)) {
            return false;
          }
        }
      }

      return true;
    }

    testFilterObj(ent, where) {
      for (var key in where) {
        if (!key || !key.length) {
          continue;
        }

        var value = where[key];

        if (value === undefined) {
          continue;
        }

        var entityKeyName = key.charAt(0).toLowerCase() + key.slice(1);
        var isDate = entityKeyName.endsWith('Utc');
        var reqValue = ent[entityKeyName];

        if (isDate) {
          reqValue = isoConvert(reqValue);

          if (reqValue) {
            reqValue = reqValue.getTime();
          }
        }

        if (Array.isArray(value)) {
          return value.indexOf(reqValue) != -1;
        } else if (value && typeof value == 'object') {
          var success = false;

          for (var filterField in filterOperators) {
            var fValue = value[filterField];

            if (fValue !== undefined && (fValue === null || isDate || typeof fValue != 'object')) {
              if (isDate) {
                fValue = isoConvert(fValue);

                if (fValue) {
                  fValue = fValue.getTime();
                }
              }

              if (!filterOperators[filterField](reqValue, fValue)) {
                return false;
              } else {
                success = true;
                break;
              }
            }
          }

          if (success) {
            continue;
          }
        }

        if (isDate) {
          value = isoConvert(value);

          if (value) {
            value = value.getTime();
          }
        }

        if (reqValue != value) {
          return false;
        }
      }

      return true;
    }

    onContentChange(e) {
      var results = this.state.results;

      if (typeof this.props.over != 'string' || !results) {
        return;
      }

      if (this.props.updateContentType) {
        if (this.props.updateContentType != e.entity.type) {
          return;
        }
      } else if (getEndpointType(this.props.over).type != e.endpointType) {
        return;
      }

      var entity = e.entity;
      this.onLiveMessage({
        entity,
        method: e.deleted ? 'delete' : e.created ? 'create' : 'update'
      });
    }

    componentDidMount() {
      document.addEventListener("contentchange", this.onContentChange);

      if (!this.state.results) {
        this.load(this.props);
      }
    }

    componentWillUnmount() {
      if (this.props.live) {
        var liveInfo = this.liveType(this.props);
        webSocket.removeEventListener(liveInfo.type, this.onLiveMessage);
      }

      document.removeEventListener("contentchange", this.onContentChange);
    }

    componentDidUpdate(prevProps) {
      var {
        over,
        filter
      } = this.props;

      if (over != prevProps.over || Array.isArray(over) && over.length != prevProps.over.length || JSON.stringify(filter) != JSON.stringify(prevProps.filter)) {
        this.load(this.props, 1);
      }
    }

    getPagedFilter(filter, pageIndex, paged) {
      if (paged) {
        if (!filter) {
          filter = {};
        }

        filter = { ...filter
        };
        filter.pageIndex = pageIndex - 1;
        filter.includeTotal = true;
        var pageSize = paged.pageSize || DEFAULT_PAGE_SIZE;

        if (typeof paged == "number") {
          pageSize = paged;
        }

        if (!filter.pageSize) {
          filter.pageSize = pageSize;
        }
      }

      return filter;
    }

    liveType(props) {
      var type = props.over.split('/')[0].toLowerCase();
      var id = 0;
      var onFilter = null;
      var filter = props.filter;

      if (filter) {
        if (filter.where) {
          if (!Array.isArray(filter.where)) {
            var {
              where
            } = filter;
            var keySet = Object.keys(where);

            if (keySet.length == 1) {
              var firstKey = keySet[0].toLowerCase();

              if (firstKey == 'id' && typeof where[keySet[0]] != 'object') {
                id = parseInt(where[keySet[0]]);
              }
            }
          }
        } else if (filter.on) {
          var on = filter.on;
          onFilter = {
            query: on.map ? 'On(' + on.type + ',?,"' + on.map + '")' : 'On(' + on.type + ',?)',
            args: [parseInt(on.id)]
          };
        }
      }

      if (props.liveFilter) {
        onFilter = props.liveFilter;
      }

      return {
        type,
        id,
        onFilter
      };
    }

    load(props, newPageIndex) {
      if (typeof props.over == 'string') {
        if (props.live) {
          var liveInfo = this.liveType(props);
          webSocket.addEventListener(liveInfo.type, this.onLiveMessage, liveInfo.id, liveInfo.onFilter);
        }

        var newState = {
          errored: false
        };

        if (newPageIndex) {
          newState.pageIndex = newPageIndex;
        }

        this.setState(newState);
        var filter = this.getPagedFilter(props.filter, newPageIndex || this.state.pageIndex, props.paged);
        webRequest(props.over.indexOf('/') == -1 ? props.over + '/list' : props.over, filter, props.requestOpts ? {
          includes: props.includes,
          ...props.requestOpts
        } : {
          includes: props.includes
        }).then(responseJson => {
          var responseJson = responseJson.json;
          var results = responseJson && responseJson.results ? responseJson.results : [];

          if (props.onResults) {
            results = props.onResults(results);
          }

          if (props.reverse) {
            results = results.reverse();
          }

          this.setState({
            results,
            errored: false,
            totalResults: responseJson.total
          });
        }).catch(e => {
          console.log('Loop caught an error:');
          console.error(e);
          var results = [];

          if (props.onResults) {
            results = this.props.onResults(results);
          }

          if (props.reverse) {
            results = results.reverse();
          }

          if (props.onFailed) {
            if (props.onFailed(e)) {
              this.setState({
                results,
                totalResults: results.length,
                errored: false
              });
              return;
            }
          }

          this.setState({
            results,
            totalResults: results.length,
            errored: true,
            errorMessage: e
          });
        });
      } else {
        this.setState(this.loadDirectArray(props, newPageIndex));
      }
    }

    loadDirectArray(props, newPageIndex) {
      var results = props.over;

      if (props.onResults) {
        results = props.onResults(results);
      }

      var pageCfg = props.paged;
      var totalResults = results.totalResults || results.length;

      if (pageCfg) {
        var offset = (newPageIndex || this.state.pageIndex) - 1;
        var pageSize = pageCfg.pageSize || DEFAULT_PAGE_SIZE;

        if (typeof pageCfg == "number") {
          pageSize = pageCfg;
        }

        var startIndex = offset * pageSize;
        results = results.slice(startIndex, startIndex + pageSize);
      }

      if (props.reverse) {
        results = results.reverse();
      }

      var newState = {
        over: null,
        jsonFilter: null,
        results,
        totalResults,
        errored: false
      };

      if (newPageIndex) {
        newState.pageIndex = newPageIndex;
      }

      return newState;
    }

    render() {
      if (this.state.errored) {
        if (this.props.onFailure) {
          if (typeof this.props.onFailure === "function") {
            return this.props.onFailure(this.state.errorMessage);
          }
        }

        return _h(Failure, null);
      }

      if (!this.state.results && !this.props.items) {
        if (this.props.loader) {
          if (typeof this.props.loader === "function") {
            return this.props.loader();
          } else {
            return `Loading...`;
          }
        }

        return null;
      }

      var results = this.state.results;
      var renderFunc = this.props.children;

      if (this.props.items) {
        results = this.props.items;
        var Module = results.renderer;

        renderFunc = (item, i, count) => {
          return _h(Module, {
            item: item,
            container: this.props
          });
        };
      }

      if (!results.length || this.props.testNone) {
        var M = this.props.noneDisplayer;

        if (M) {
          return _h(M, {
            loopAllProps: this.props
          });
        }

        return this.props.orNone ? this.props.orNone() : null;
      }

      var className = 'loop ' + (this.props.name ? this.props.name : typeof this.props.over == 'String' ? this.props.over.replace('/', '-') : '');

      if (this.props.className) {
        var className = this.props.className;
      }

      if (this.props.groupAll) {
        results = [results];
      }

      if (this.props.inGroupsOf && this.props.inGroupsOf > 0) {
        var newResults = [];
        var groupsOf = this.props.inGroupsOf;

        for (var i = 0; i < results.length; i += groupsOf) {
          newResults.push(results.slice(i, i + groupsOf));
        }

        results = newResults;
      }

      var mode = this.props.mode;

      if (this.props.colXs || this.props.colSm || this.props.colMd || this.props.colLg || this.props.colXl) {
        mode = "col";
      } else if (this.props.altRow) {
        mode = "altrow";
      } else if (this.props.asTable) {
        mode = "table";
      } else if (this.props.asUl) {
        mode = "ul";
      } else if (this.props.asCols) {
        mode = "cols";
      } else if (this.props.raw) {
        mode = "raw";
      } else if (this.props.inline) {
        mode = "inline";
      }

      var loopContent = null;

      switch (mode) {
        case "inline":
          loopContent = _h("span", {
            className: className
          }, results.map((item, i) => {
            return _h("span", {
              className: 'loop-item loop-item-' + i,
              key: i
            }, renderFunc(item, i, results.length));
          }));
          break;

        case "raw":
          loopContent = results.map((item, i) => {
            return renderFunc(item, i, results.length);
          });
          break;

        case "unformatted":
          loopContent = _h("span", {
            className: className
          }, results.map((item, i) => {
            return renderFunc(item, i, results.length);
          }));
          break;

        case "cols":
        case "columns":
          var size = parseInt(this.props.size);

          if (!size || isNaN(size)) {
            size = 4;
          }

          if (size <= 0) {
            size = 1;
          } else if (size > 12) {
            size = 12;
          }

          var colCount = Math.floor(12 / size);
          var rowCount = Math.ceil(results.length / colCount);
          var col = 0;
          var rows = [];

          for (var r = 0; r < rowCount; r++) {
            var cols = [];

            for (var c = 0; c < colCount; c++) {
              if (col >= results.length) {
                break;
              }

              var item = results[col];
              cols.push(_h(Column, {
                size: size,
                className: 'loop-item loop-item-' + col,
                key: c
              }, renderFunc(item, i, results.length)));
              col++;
            }

            rows.push(_h(Row, {
              className: "loop-row",
              key: r
            }, cols));
          }

          loopContent = _h("div", {
            className: className
          }, rows);
          break;

        case "ul":
        case "bulletpoints":
          loopContent = _h("ul", {
            className: className,
            ...this.props.attributes
          }, results.map((item, i) => {
            return _h("li", {
              className: 'loop-item loop-item-' + i + ' ' + (this.props.subClassName ? this.props.subClassName : ''),
              key: i
            }, renderFunc(item, i, results.length));
          }));
          break;

        case "table":
          var headerFunc = null;
          var bodyFunc = renderFunc;
          var footerFunc = null;

          if (renderFunc.length && !this.props.items) {
            if (renderFunc.length == 1) {
              bodyFunc = renderFunc[0];
            } else {
              headerFunc = renderFunc[0];
              bodyFunc = renderFunc[1];

              if (renderFunc.length > 2) {
                footerFunc = renderFunc[2];
              }
            }
          }

          loopContent = _h("table", {
            className: "table " + className
          }, headerFunc && _h("thead", null, headerFunc(results)), _h("tbody", null, results.map((item, i) => {
            return _h("tr", {
              className: 'loop-item loop-item-' + i,
              key: i
            }, bodyFunc(item, i, results.length));
          })), footerFunc && _h("tfoot", null, footerFunc(results)));
          break;

        case "col":
          var breakpoints = ['Xs', 'Sm', 'Md', 'Lg', 'Xl'];
          var breakpointClasses = "";
          breakpoints.forEach(breakpoint => {
            var width = this.props["col" + breakpoint];

            if (width > 0) {
              breakpointClasses += " col-" + breakpoint.toLowerCase() + "-" + width;
            }
          });
          loopContent = _h("div", {
            className: className
          }, results.map((item, i) => {
            var classes = breakpointClasses + ' loop-item loop-item-' + i;
            return _h("div", {
              className: classes,
              key: i
            }, renderFunc(item, i, results.length));
          }));
          break;

        case "altrow":
          loopContent = _h("div", {
            className: className
          }, results.map((item, i) => {
            return i % 2 == 0 ? _h("div", {
              className: 'row loop-item loop-item-' + i,
              key: i
            }, renderFunc(item, i, results.length)) : _h("div", {
              className: 'row row-alt loop-item loop-item-' + i,
              key: i
            }, renderFunc(item, i, results.length));
          }));
          break;

        default:
          loopContent = _h("div", {
            className: className
          }, results.map((item, i) => {
            return _h("div", {
              className: 'loop-item loop-item-' + i + ' ' + (this.props.subClassName ? this.props.subClassName : ''),
              key: i
            }, renderFunc(item, i, results.length));
          }));
      }

      var pageCfg = this.props.paged;

      if (!pageCfg) {
        return loopContent;
      }

      var pageSize = pageCfg.pageSize || DEFAULT_PAGE_SIZE;
      var showInput = pageCfg.showInput !== undefined ? pageCfg.showInput : undefined;
      var maxLinks = pageCfg.maxLinks || undefined;

      if (typeof pageCfg == "number") {
        pageSize = pageCfg;
      }

      if (this.props.filter && this.props.filter.pageSize) {
        pageSize = this.props.filter.pageSize;
      }

      if (typeof pageCfg == "object" && pageCfg.mobilePageSize) {
        if (window.matchMedia('(max-width: 752px) and (pointer: coarse) and (orientation: portrait)').matches || window.matchMedia('(max-height: 752px) and (pointer: coarse) and (orientation: landscape)').matches) {
          pageSize = pageCfg.mobilePageSize;
        }
      }

      var Module = pageCfg.module || Paginator;

      var paginator = _h(Module, {
        pageSize: pageSize,
        showInput: showInput,
        maxLinks: maxLinks,
        pageIndex: this.state.pageIndex,
        totalResults: this.state.totalResults,
        onChange: pageIndex => {
          this.load(this.props, pageIndex);
          global.scrollTo && global.scrollTo(0, 0);
        }
      });

      var result = [];

      if (pageCfg.top) {
        result.push(paginator);
      }

      result.push(loopContent);

      if (pageCfg.bottom !== false) {
        result.push(paginator);
      }

      return result;
    }

  }

  exports.default = Loop;
  Loop.propTypes = {
    items: 'set',
    mode: ['table', 'columns', 'inline', 'bulletpoints', 'unformatted', 'altrows'],
    inGroupsOf: 'int'
  };
  Loop.icon = 'list';
};__mm["UI/Functions/SubmitForm"] = function (global, exports) {
  const webRequest = _rq("UI/Functions/WebRequest").default;

  exports.default = function (e, options) {
    options = options || {};
    e.preventDefault();
    var fields = e.target.elements;
    var values = {};
    var validationErrors = 0;

    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];

      if (!field.name || field.type == 'radio' && !field.checked) {
        continue;
      }

      if (field.onValidationCheck && field.onValidationCheck(field)) {
        validationErrors++;
      }

      var value = field.type == 'checkbox' ? field.checked : field.value;

      if (field.onGetValue) {
        value = field.onGetValue(value, field, e);
        field.value = value;
      }

      values[field.name] = value;
    }

    if (e.submitter && e.submitter.name) {
      values[e.submitter.name] = e.submitter.value;
    }

    if (validationErrors) {
      if (options.onFailed) {
        options.onFailed('VALIDATION', validationErrors, e);
      }

      return;
    }

    var action = e.target.action;

    values.setAction = newAction => {
      action = newAction;
    };

    if (options.onValues) {
      values = options.onValues(values, e);
    }

    Promise.resolve(values).then(values => {
      if (values) {
        delete values.setAction;
      }

      if (!action) {
        options.onSuccess && options.onSuccess({
          formHasNoAction: true,
          ...values
        }, values, e);
        return;
      }

      return webRequest(action, values, options.requestOpts).then(response => {
        if (response.ok) {
          setTimeout(() => {
            options.onSuccess && options.onSuccess(response.json, values, e);
          }, 1);
        } else {
          options.onFailed && options.onFailed(response.json, values, e);
        }
      });
    }).catch(err => {
      console.log(err);
      options.onFailed && options.onFailed(err);
    });
    return false;
  };
};_rq('UI/Start').default();