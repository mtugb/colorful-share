import { Elysia, t } from "elysia";
import { cors } from '@elysia/cors'

// EX) FFFFFF
function generateKey() {
    return Array.from(
        { length: 3 },
        () => Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
    ).join("");
}

interface FileEntry {
    buffer: ArrayBuffer,
    filename: string
}

const fileMap: Map<string, FileEntry> = new Map();

const app = new Elysia()
    .post("/api/files", ({ body, query: { filename }, headers }) => {
        console.dir({ body, bodyType: typeof body, headers }, { depth: null })
        const buffer: ArrayBuffer = body as ArrayBuffer; // メモリ確保＆ファイル展開
        const key = generateKey();
        fileMap.set(key, {
            buffer,
            filename: filename ?? "unknown.bin"
        });
        return Response.json({
            ok: true,
            data: {
                fileKey: key
            }
        }, { status: 200 })
    }, {
        // body: t.ArrayBuffer(),
        query: t.Object({
            filename: t.String()
        }),
        response: t.Object({
            ok: t.Boolean(),
            data: t.Object({
                fileKey: t.String()
            })
        })
    })
    .get("/api/files/:key/filename", ({ params: { key } }) => {
        const fileEntry = fileMap.get(key);
        if (fileEntry === undefined) {
            return Response.json({ ok: false, error: "not found" }, { status: 404 });
        }
        return Response.json({
            ok: true,
            data: {
                filename: fileEntry.filename
            }
        }, { status: 200 })
    }, {
        params: t.Object({
            key: t.String()
        }),
        response: t.Object({
            ok: t.Boolean(),
            data: t.Object({
                filename: t.String()
            })
        })
    })
    .get("/api/files/:key/download", ({ params: { key }, set }) => {
        const fileEntry = fileMap.get(key);
        if (fileEntry === undefined) {
            set.status = 404;
            return { ok: false, error: "not found" };
        }
        set.headers["content-type"] = "application/octet-stream";
        return fileEntry.buffer;
    }, {
        params: t.Object({
            key: t.String()
        }),
    })
    .use(cors())
    .listen(3000);

export type App = typeof app;

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
