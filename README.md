# svgedit-serve

Serves [SVG-Edit](https://github.com/SVG-Edit/svgedit) on localhost.

```
NPM_CONFIG_ALLOW_GIT=all npx github:tkurki/serve-svgedit        # http://localhost:8000
NPM_CONFIG_ALLOW_GIT=all npx github:tkurki/serve-svgedit 9000   # custom port
```

In Chrome/Edge, File → Open then Save writes back to the same file (File System Access API).
