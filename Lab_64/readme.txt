Para acessar a pagina inicial:
curl http://localhost:3000/

Para acessar a pagina sobre:
curl http://localhost:3000/about

Para acessar a pagina de api:
curl http://localhost:3000/api

Para acessar a pagina de erro, digite qualquer outra rota:
curl http://localhost:3000/err

Para testar o POST, abra um terminal e digite:
curl -X POST http://127.0.0.1:3000/upload -d "fileData=simulacao"