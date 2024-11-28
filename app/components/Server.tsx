import { decode, encode } from "base-64";

let URL = ""; // Initially empty

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = [].slice.call(new Uint8Array(buffer));
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return encode(binary);
}

function updateURL(newURL: string) {
  URL = newURL; // Dynamically update the URL
  console.log("Updated URL:", URL);
}

function ping() {
  if (!URL) {
    console.error("URL is not set. Cannot ping.");
    return;
  }
  fetch(URL + "/ping").catch((e) => console.error(e));
}

async function cut(imageURI: string) {
  const formData = new FormData();
  formData.append("data", {
    uri: imageURI,
    name: "photo",
    type: "image/jpg",
  });

  const resp = await fetch(URL + "/cut", {
    method: "POST",
    body: formData,
  }).then(async (res) => {
    console.log("> converting...");
    const buffer = await res.arrayBuffer();
    const base64Flag = "data:image/png;base64,";
    const imageStr = arrayBufferToBase64(buffer);
    return base64Flag + imageStr;
  });

  return resp;
}

async function paste(imageURI: string) {
  const formData = new FormData();
  formData.append("data", {
    uri: imageURI,
    name: "photo",
    type: "image/png",
  });

  const resp = await fetch(URL + "/paste", {
    method: "POST",
    body: formData,
  }).then((r) => r.json());

  return resp;
}

export default {
  updateURL, // Export the new function
  ping,
  cut,
  paste,
};
