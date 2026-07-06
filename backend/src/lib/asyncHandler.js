// Envuelve un handler async de Express para que las excepciones/rechazos
// lleguen a next(err) en vez de crashear el proceso (Express 4 no las captura solo).
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
