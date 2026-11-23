const messagelist = document.getElementById("messagelist");
const input = document.getElementById("input");
const button = document.getElementById("button");

function addmessage(teks, kelas, kutipan) {
    const div = document.createElement("div");
    div.className = kelas;

    if (kutipan) {
        const q = document.createElement("div");
        q.className = "replyquote";
        q.textContent = kutipan;
        div.appendChild(q);
    }

    const isi = document.createElement("div");
    isi.className = "bubbletext";
    isi.textContent = teks;
    div.appendChild(isi);

    messagelist.appendChild(div);
    messagelist.scrollTop = messagelist.scrollHeight;
    return div;
}

function settext(div, teks) {
    div.querySelector(".bubbletext").textContent = teks;
    messagelist.scrollTop = messagelist.scrollHeight;
}

async function send() {
    const teks = input.value.trim();
    if (teks === "") return;

    addmessage(teks, "bubbleuser");
    input.value = "";
    button.disabled = true;

    const bot = addmessage("Mengetik...", "bubblebot", teks);

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: teks })
        });
        const data = await res.json();
        settext(bot, data.reply);
    } catch (err) {
        settext(bot, "Maaf, Mimo lagi nggak bisa dihubungi 😢");
    } finally {
        button.disabled = false;
        input.focus();
    }
}

button.addEventListener("click", send);
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") send();
});