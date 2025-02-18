var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/linters/designSystem.ts
function checkDesignSystemCompliance(node) {
  var _a;
  const results = [];
  if (node.type === "INSTANCE") {
    if (!node.mainComponent) {
      results.push({
        type: "error",
        message: "Detached component instance detected",
        node,
        category: "design-system",
        fixable: false
      });
    }
    if (node.mainComponent && ((_a = node.mainComponent.parent) == null ? void 0 : _a.type) === "COMPONENT_SET") {
      const mainComponent = node.mainComponent;
      const componentSet = mainComponent.parent;
      for (const [key, value] of Object.entries(node.componentProperties)) {
        if (!componentSet.componentPropertyDefinitions[key]) {
          results.push({
            type: "error",
            message: `Invalid variant property: ${key}`,
            node,
            category: "design-system",
            fixable: true
          });
        }
      }
    }
  }
  if ("children" in node) {
    for (const child of node.children) {
      results.push(...checkDesignSystemCompliance(child));
    }
  }
  return results;
}
var init_designSystem = __esm({
  "src/linters/designSystem.ts"() {
    "use strict";
  }
});

// src/linters/styles.ts
function checkStyles(node) {
  const results = [];
  if ("fills" in node) {
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach((fill) => {
        if (fill.type === "SOLID" && !fill.styleId) {
          results.push({
            type: "warning",
            message: "Hard-coded color detected",
            node,
            category: "styles",
            fixable: true
          });
        }
      });
    }
  }
  if ("effects" in node) {
    if (node.effects && Array.isArray(node.effects) && node.effects.length > 0 && !node.effectStyleId) {
      results.push({
        type: "warning",
        message: "Hard-coded effect detected",
        node,
        category: "styles",
        fixable: true
      });
    }
  }
  if (node.type === "TEXT") {
    if (!node.textStyleId) {
      results.push({
        type: "warning",
        message: "Hard-coded text style detected",
        node,
        category: "styles",
        fixable: true
      });
    }
  }
  if ("children" in node) {
    for (const child of node.children) {
      results.push(...checkStyles(child));
    }
  }
  return results;
}
var init_styles = __esm({
  "src/linters/styles.ts"() {
    "use strict";
  }
});

// src/linters/accessibility.ts
function calculateContrastRatio(foreground, background) {
  const getLuminance = (color) => {
    const [r, g, b] = [color.r, color.g, color.b].map((val) => {
      val = val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      return val;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
function checkAccessibility(node) {
  var _a;
  const results = [];
  if (node.type === "TEXT") {
    if (node.fontSize < 12) {
      results.push({
        type: "error",
        message: "Text size too small for accessibility",
        node,
        category: "accessibility",
        fixable: true
      });
    }
    if ("fills" in node && node.fills && Array.isArray(node.fills)) {
      const textFill = node.fills.find((fill) => fill.type === "SOLID");
      if (textFill && textFill.type === "SOLID") {
        const parent = node.parent;
        if (parent && "fills" in parent) {
          const backgroundFill = (_a = parent.fills) == null ? void 0 : _a.find((fill) => fill.type === "SOLID");
          if (backgroundFill && backgroundFill.type === "SOLID") {
            const contrastRatio = calculateContrastRatio(
              textFill.color,
              backgroundFill.color
            );
            if (contrastRatio < 4.5) {
              results.push({
                type: "error",
                message: `Insufficient contrast ratio: ${contrastRatio.toFixed(2)}:1`,
                node,
                category: "accessibility",
                fixable: true
              });
            }
          }
        }
      }
    }
  }
  if ("children" in node) {
    for (const child of node.children) {
      results.push(...checkAccessibility(child));
    }
  }
  return results;
}
var init_accessibility = __esm({
  "src/linters/accessibility.ts"() {
    "use strict";
  }
});

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_ui();
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default,
  lintDesign: () => lintDesign
});
async function lintDesign(options) {
  const results = [];
  const nodes = figma.currentPage.selection.length > 0 ? figma.currentPage.selection : figma.currentPage.children;
  for (const node of nodes) {
    if (options.ignoredNodes.includes(node.id)) continue;
    if (options.checkDesignSystem) {
      results.push(...checkDesignSystemCompliance(node));
    }
    if (options.checkStyles) {
      results.push(...checkStyles(node));
    }
    if (options.checkAccessibility) {
      results.push(...checkAccessibility(node));
    }
  }
  const fixableIssues = results.filter((result) => result.fixable).length;
  return {
    results,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    totalIssues: results.length,
    fixableIssues
  };
}
async function main_default() {
  showUI({ width: 450, height: 600 });
  const devMode = figma.editorType === "dev";
  await figma.loadAllPagesAsync();
  figma.ui.onmessage = async (msg) => {
    if (msg.type === "run-lint") {
      const report = await lintDesign(msg.options);
      figma.ui.postMessage({ type: "lint-complete", report });
    } else if (msg.type === "fix-issue") {
      const { issueId, fixType } = msg;
    } else if (msg.type === "export-report") {
    }
  };
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_designSystem();
    init_styles();
    init_accessibility();
    init_lib();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = true ? "src/main.ts--default" : figma.command;
modules[commandId]();
