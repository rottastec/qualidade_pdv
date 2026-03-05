{
  "name": "PDV",
  "type": "object",
  "properties": {
    "nome": {
      "type": "string",
      "description": "Nome do ponto de venda"
    },
    "endereco": {
      "type": "string",
      "description": "Endere\u00e7o completo"
    },
    "cidade": {
      "type": "string",
      "description": "Cidade"
    },
    "estado": {
      "type": "string",
      "description": "Estado (UF)"
    },
    "responsavel_pdv": {
      "type": "string",
      "description": "Respons\u00e1vel pelo setor PDV"
    },
    "responsavel_mkt": {
      "type": "string",
      "description": "Respons\u00e1vel pelo setor MKT"
    },
    "responsavel_comercial": {
      "type": "string",
      "description": "Respons\u00e1vel pelo setor Comercial"
    },
    "telefone": {
      "type": "string",
      "description": "Telefone de contato"
    },
    "status": {
      "type": "string",
      "enum": [
        "ativo",
        "inativo"
      ],
      "default": "ativo"
    }
  },
  "required": [
    "nome",
    "cidade",
    "estado"
  ]
}