# 🧬 PokéAPI Turbo ⚡ – Sua Pokédex Digital em Código!

Bem-vindo(a) à **PokéAPI Turbo**, um projeto poderoso, educativo e super divertido que traz o universo Pokémon diretamente para o seu terminal, navegador ou aplicação via **API RESTful**!  

Este projeto é ideal para quem ama Pokémon e quer aprender/praticar desenvolvimento de APIs, consumo de dados em JSON, integração com front-end, uso de frameworks, e muito mais.

---

## 🧠 O que é este projeto?

A **PokéAPI Turbo** é uma API que fornece informações completas e atualizadas sobre os Pokémons: nomes, tipos, habilidades, evoluções, imagens, e até curiosidades! É como uma Pokédex digital que você pode consultar via HTTP!

Você pode usá-la para criar:

- Aplicativos de Pokédex interativos
- Bots de Discord/Telegram
- Extensões de navegador
- Projetos com React/Vue/Angular
- Treinamento de APIs REST

---

## 🚀 Tecnologias Usadas

- JavaScript
- Axios / Fetch para consumo de APIs externas (como a PokéAPI original)
- HTML5

---

## 📡 Endpoints Disponíveis

| Método | Rota               | Descrição                          |
|--------|--------------------|------------------------------------|
| GET    | `/pokemons`        | Lista todos os Pokémons            |
| GET    | `/pokemon/:id`     | Retorna detalhes de um Pokémon     |
| GET    | `/type/:type`      | Lista Pokémons por tipo            |
| GET    | `/random`          | Retorna um Pokémon aleatório       |
| POST   | `/favorites`       | Adiciona Pokémon aos favoritos     |
| GET    | `/favorites`       | Lista Pokémons favoritos           |

✅ Todos os dados são retornados em **JSON**

---

## 📷 Exemplo de Resposta

```json
{
  "id": 25,
  "name": "pikachu",
  "type": ["electric"],
  "height": 0.4,
  "weight": 6.0,
  "abilities": ["static", "lightning-rod"],
  "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
}
```

## 🛠️ Como Rodar o Projeto Localmente

```bash

# 1 - Clone o repositório
git clone https://github.com/Caiojosue/Poke_API

# 2 - Abra o Arquivo HTML

# 3 - Desfrute da API
```

## 🌐 Deploy

- Vercel / Render / Heroku / Railway
- Link para acessar: https://<link-do-seu-deploy>.vercel.app (exemplo)

## 💡 Curiosidades Pokémon

- A PokéAPI oficial possui mais de 1.000 Pokémons registrados
- O Pokémon número 000 é o MissingNo – um glitch clássico
- Pikachu não era para ser o mascote principal – era o Clefairy!

## 💬 Contribuindo

Contribuições são super bem-vindas! Se você tiver ideias de melhorias, novos endpoints ou até skins temáticas para a Pokédex, manda ver! 🚀

Faça um fork
Crie sua branch: git checkout -b feature/nova-feature
Commit suas mudanças: git commit -m 'Adiciona nova feature'
Push: git push origin feature/nova-feature
Crie um Pull Request

## 📚 Fontes de Dados

PokéAPI Oficial
Bulbapedia
Serebii.net

## 🧑‍💻 Autor

Caio Sando
