import { defineConfig } from "tsup";
import { treeShakableConfig } from "../../tsup.config";

export default defineConfig({
    ...treeShakableConfig,
});
