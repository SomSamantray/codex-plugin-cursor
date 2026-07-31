import assert from "node:assert/strict";
import test from "node:test";

import { parseStopReviewOutput } from "../plugins/codex/scripts/stop-review-gate-hook.mjs";

const ESCAPE_COMMAND = "/codex:setup --disable-review-gate";

test("parseStopReviewOutput includes escape command for empty output", () => {
  const result = parseStopReviewOutput("");
  assert.equal(result.ok, false);
  assert.match(result.reason, new RegExp(ESCAPE_COMMAND.replace("/", "\\/")));
});

test("parseStopReviewOutput includes escape command for unexpected answer", () => {
  const result = parseStopReviewOutput("maybe later");
  assert.equal(result.ok, false);
  assert.match(result.reason, new RegExp(ESCAPE_COMMAND.replace("/", "\\/")));
});

test("parseStopReviewOutput allows clean stop review", () => {
  const result = parseStopReviewOutput("ALLOW: No blocking issues found.");
  assert.equal(result.ok, true);
  assert.equal(result.reason, null);
});

test("parseStopReviewOutput omits escape command for Codex BLOCK findings", () => {
  const result = parseStopReviewOutput("BLOCK: Missing empty-state guard");
  assert.equal(result.ok, false);
  assert.match(result.reason, /still need fixes/i);
  assert.doesNotMatch(result.reason, new RegExp(ESCAPE_COMMAND.replace("/", "\\/")));
});
