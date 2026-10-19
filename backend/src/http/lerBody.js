function lerBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (erro) {
        reject(erro);
      }
    });
    req.on("error", reject);
  });
}
module.exports  = {lerBody};