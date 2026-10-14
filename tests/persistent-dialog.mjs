import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
const js=await readFile(new URL("../scripts/h0d-machine-builder.js",import.meta.url),"utf8");
assert.ok(js.includes("DialogV2.wait({")||js.includes("Dialog.wait({"),"Persistent Foundry dialog required");
assert.ok(js.includes('action:"close"'),"Explicit close control required");
assert.ok(js.includes("busy=true"),"Double-click lock required");
assert.ok(js.includes("button.disabled=true"),"Disable active action while busy");

assert.ok(js.includes('data-h0d-batch-run'),"Repeat button required");
assert.ok(js.includes("new FormData(form)"),"Read form again on each execution");
assert.ok(!js.includes("const result = await foundry.applications.api.DialogV2.input"),"Do not use one-shot input for primary builder");

console.log("OK: h0d-machine-builder persistent multi-generation window controls");
