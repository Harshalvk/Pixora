"use server";

export async function UploadFile({
  file,
  token,
}: {
  file: File;
  token: string;
}) {
  try {
    const response = await fetch(
      `http://localhost:5050/v1/user/presignedUrl/${file.name}`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );
    const body = await response.json();

    await fetch(body.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    const putImage = `http://localhost:8080/pixora/${file.name}`;

    return putImage;
  } catch (error) {
    console.log("errror uploading file");
    return;
  }
}
