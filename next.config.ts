import type { NextConfig } from "next";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";

class ServerChunkAliasPlugin {
  apply(compiler: { hooks: { afterEmit: { tap: (name: string, callback: () => void) => void } } }) {
    compiler.hooks.afterEmit.tap("ServerChunkAliasPlugin", () => {
      const serverDir = join(process.cwd(), ".next", "server");
      const chunksDir = join(serverDir, "chunks");
      if (!existsSync(chunksDir)) return;
      mkdirSync(serverDir, { recursive: true });
      for (const file of readdirSync(chunksDir)) {
        if (!file.endsWith(".js")) continue;
        copyFileSync(join(chunksDir, file), join(serverDir, file));
      }
    });
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = [...(config.plugins ?? []), new ServerChunkAliasPlugin()];
    }
    return config;
  }
};

export default nextConfig;
