<script lang="ts">
    import { treaty } from "@elysia/eden";
    import type { App } from "../../../../api/src/index.ts";
    const client = treaty<App>("localhost:3000");
    interface Entry {
        key: string;
        name: string;
    }
    let files = $state<FileList>();
    let filer = $state<HTMLInputElement>();
    let uploads = $state<Entry[]>([]);

    async function upload() {
        if (!files) {
            alert("unexpected error");
            return;
        }
        if (files.length > 1) {
            alert("This app accepts single file");
            return;
        }
        const file = files?.[0];
        if (!file) {
            alert("ファイルを選択してください");
            return;
        }
        // const { data, error } = await client.api.files.post(
        //     await file.arrayBuffer(),
        //     {
        //         query: { filename: file.name },
        //     },
        // );
        const response = await fetch(
            `http://localhost:3000/api/files?filename=${file.name}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: await file.arrayBuffer(),
            },
        );
        if (!response.ok)
            throw Error(`${response.status}: ${response.statusText}`);
        const result = await response.json();
        console.log({ result });

        uploads.push({
            key: result.data.fileKey as string,
            name: file.name,
        });

        if (filer) filer.value = "";
    }
</script>

<h1>Colorful File Sharerer</h1>

<h2>Upload</h2>
<input type="file" id="uploader" hidden bind:files bind:this={filer} />
<button onclick={upload}>upload</button>
<table>
    <thead>
        <tr>
            <th>Key</th>
            <th>FileName</th>
        </tr>
    </thead>
    <tbody>
        {#each uploads as { key, name }}
            <tr>
                <td>{key}</td>
                <td>{name}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style></style>
