import assert from "node:assert/strict";
import test from "node:test";

import { parseArgs } from "../plugins/codex/scripts/lib/args.mjs";

const TASK_CONFIG = {
  valueOptions: ["model", "effort", "cwd", "prompt-file"],
  booleanOptions: ["json", "write", "resume-last", "resume", "fresh", "background"],
  aliasMap: {
    m: "model",
    C: "cwd"
  }
};

test("parseArgs with stopAtFirstPositional keeps prompt fragments out of options", () => {
  const result = parseArgs(["--write", "review", "-m", "pytest"], {
    ...TASK_CONFIG,
    stopAtFirstPositional: true
  });

  assert.equal(result.options.write, true);
  assert.equal(result.options.model, undefined);
  assert.equal(result.positionals.join(" "), "review -m pytest");
});

test("parseArgs without stopAtFirstPositional still consumes -m as model", () => {
  const result = parseArgs(["--write", "review", "-m", "pytest"], TASK_CONFIG);

  assert.equal(result.options.write, true);
  assert.equal(result.options.model, "pytest");
  assert.equal(result.positionals.join(" "), "review");
});

test("parseArgs honors -- passthrough before stopAtFirstPositional matters", () => {
  const result = parseArgs(["--write", "--", "-m", "pytest"], {
    ...TASK_CONFIG,
    stopAtFirstPositional: true
  });

  assert.equal(result.options.write, true);
  assert.equal(result.options.model, undefined);
  assert.equal(result.positionals.join(" "), "-m pytest");
});
