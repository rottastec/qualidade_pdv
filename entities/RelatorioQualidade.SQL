{
  "name": "RelatorioQualidade",
  "type": "object",
  "properties": {
    "pdv_id": {
      "type": "string",
      "description": "ID do PDV avaliado"
    },
    "pdv_nome": {
      "type": "string",
      "description": "Nome do PDV (para refer\u00eancia r\u00e1pida)"
    },
    "data_visita": {
      "type": "string",
      "format": "date",
      "description": "Data da visita"
    },
    "auditor": {
      "type": "string",
      "description": "Nome do auditor/avaliador"
    },
    "status": {
      "type": "string",
      "enum": [
        "rascunho",
        "finalizado"
      ],
      "default": "rascunho"
    },
    "resultado": {
      "type": "string",
      "enum": [
        "aprovado",
        "reprovado",
        "pendente"
      ],
      "default": "pendente"
    },
    "nota_geral": {
      "type": "number",
      "description": "Nota geral do PDV (0-100)"
    },
    "itens_avaliacao": {
      "type": "array",
      "description": "Lista de itens avaliados",
      "items": {
        "type": "object",
        "properties": {
          "categoria": {
            "type": "string"
          },
          "item": {
            "type": "string"
          },
          "nota": {
            "type": "number"
          },
          "conforme": {
            "type": "boolean"
          },
          "observacao": {
            "type": "string"
          },
          "imagens": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    },
    "observacoes_gerais": {
      "type": "string",
      "description": "Observa\u00e7\u00f5es gerais sobre a visita"
    },
    "plano_acao": {
      "type": "string",
      "description": "Plano de a\u00e7\u00e3o para corre\u00e7\u00f5es"
    },
    "visivel_comercial": {
      "type": "boolean",
      "default": true,
      "description": "Define se o relatório pode ser visualizado pelo time comercial"
    }
  },
  "required": [
    "pdv_id",
    "data_visita",
    "auditor"
  ]
}