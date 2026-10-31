<script lang="ts">
    import { treaty } from "@elysia/eden";
    import type { App } from "../../../../api/src/index.ts";
    const client = treaty<App>("localhost:3000");
    let key = $state("#000000");

    function onKeyChange(e: KeyboardEvent) {
        const tgt = e.target;
        if (!tgt) return;
        console.log(1);
        if (!(tgt instanceof HTMLInputElement)) return;
        console.log(2);
        if (!/^[a-zA-Z0-9]{6}$/.test(tgt.value)) return;
        console.log(3);
        key = tgt.value;
    }

    async function fetchFileName() {
        const { data, error } = await client.api.files({ key }).filename.get();
        if (error) throw new Error("Failed to fetch filename");
        const filename = data.data.filename;
        return filename;
    }

    async function download() {
        const { data, error } = await client.api.files({ key }).download.get();
        console.log("hello", data);
        if (error) return;
        // const buffer = await data.arrayBuffer();
        if (data instanceof ArrayBuffer) {
            const buffer = data;
            const blob = new Blob([buffer], {
                type: "application/octet-stream",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = await fetchFileName();
            a.click();
        } else {
            console.error(data.error);
        }
    }
</script>

<h1>Colorful File Sharerer</h1>

<h2>Download</h2>
<div class="downloader">
    <div class="key-input">
        <span style="color: #{key}">#</span>
        <input type="text" placeholder="CCCCCC" onkeyup={onKeyChange} />
    </div>
    <button onclick={download}>Download</button>
</div>

<style>
    .downloader {
        display: flex;
    }
    .key-input {
        display: flex;
        align-items: center;
        gap: 5px;
        span {
            font-size: 20px;
            vertical-align: middle;
            transform: translateY(-3px);
            font-weight: bold;
            color: gray;
        }
    }
</style>
