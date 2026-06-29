import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const locations = [
  // Santa Catarina cities (pilot state — comprehensive list)
  { country: "Brasil", state: "Santa Catarina", city: "Abdon Batista", ibgeCode: "4200051" },
  { country: "Brasil", state: "Santa Catarina", city: "Alegrete" },
  { country: "Brasil", state: "Santa Catarina", city: "Alfredo Wagner" },
  { country: "Brasil", state: "Santa Catarina", city: "Anita Garibaldi" },
  { country: "Brasil", state: "Santa Catarina", city: "Araquari" },
  { country: "Brasil", state: "Santa Catarina", city: "Araranguá" },
  { country: "Brasil", state: "Santa Catarina", city: "Balneário Camboriú" },
  { country: "Brasil", state: "Santa Catarina", city: "Balneário Piçarras" },
  { country: "Brasil", state: "Santa Catarina", city: "Biguaçu" },
  { country: "Brasil", state: "Santa Catarina", city: "Blumenau" },
  { country: "Brasil", state: "Santa Catarina", city: "Bombinhas" },
  { country: "Brasil", state: "Santa Catarina", city: "Braço do Norte" },
  { country: "Brasil", state: "Santa Catarina", city: "Brusque" },
  { country: "Brasil", state: "Santa Catarina", city: "Caçador" },
  { country: "Brasil", state: "Santa Catarina", city: "Camboriú" },
  { country: "Brasil", state: "Santa Catarina", city: "Campo Alegre" },
  { country: "Brasil", state: "Santa Catarina", city: "Campos Novos" },
  { country: "Brasil", state: "Santa Catarina", city: "Canelinha" },
  { country: "Brasil", state: "Santa Catarina", city: "Canoinhas" },
  { country: "Brasil", state: "Santa Catarina", city: "Capinzal" },
  { country: "Brasil", state: "Santa Catarina", city: "Chapecó" },
  { country: "Brasil", state: "Santa Catarina", city: "Concórdia" },
  { country: "Brasil", state: "Santa Catarina", city: "Criciúma" },
  { country: "Brasil", state: "Santa Catarina", city: "Curitibanos" },
  { country: "Brasil", state: "Santa Catarina", city: "Florianópolis" },
  { country: "Brasil", state: "Santa Catarina", city: "Forquilhinha" },
  { country: "Brasil", state: "Santa Catarina", city: "Fraiburgo" },
  { country: "Brasil", state: "Santa Catarina", city: "Garopaba" },
  { country: "Brasil", state: "Santa Catarina", city: "Gaspar" },
  { country: "Brasil", state: "Santa Catarina", city: "Governador Celso Ramos" },
  { country: "Brasil", state: "Santa Catarina", city: "Gravatal" },
  { country: "Brasil", state: "Santa Catarina", city: "Guaramirim" },
  { country: "Brasil", state: "Santa Catarina", city: "Içara" },
  { country: "Brasil", state: "Santa Catarina", city: "Ilhota" },
  { country: "Brasil", state: "Santa Catarina", city: "Imbituba" },
  { country: "Brasil", state: "Santa Catarina", city: "Indaial" },
  { country: "Brasil", state: "Santa Catarina", city: "Itajaí" },
  { country: "Brasil", state: "Santa Catarina", city: "Itapema" },
  { country: "Brasil", state: "Santa Catarina", city: "Itapoá" },
  { country: "Brasil", state: "Santa Catarina", city: "Jaguaruna" },
  { country: "Brasil", state: "Santa Catarina", city: "Jaraguá do Sul" },
  { country: "Brasil", state: "Santa Catarina", city: "Joaçaba" },
  { country: "Brasil", state: "Santa Catarina", city: "Joinville" },
  { country: "Brasil", state: "Santa Catarina", city: "Lages" },
  { country: "Brasil", state: "Santa Catarina", city: "Laguna" },
  { country: "Brasil", state: "Santa Catarina", city: "Mafra" },
  { country: "Brasil", state: "Santa Catarina", city: "Navegantes" },
  { country: "Brasil", state: "Santa Catarina", city: "Nova Veneza" },
  { country: "Brasil", state: "Santa Catarina", city: "Orleans" },
  { country: "Brasil", state: "Santa Catarina", city: "Palhoça" },
  { country: "Brasil", state: "Santa Catarina", city: "Passo de Torres" },
  { country: "Brasil", state: "Santa Catarina", city: "Penha" },
  { country: "Brasil", state: "Santa Catarina", city: "Porto Belo" },
  { country: "Brasil", state: "Santa Catarina", city: "Rio do Sul" },
  { country: "Brasil", state: "Santa Catarina", city: "Rio Negrinho" },
  { country: "Brasil", state: "Santa Catarina", city: "São Bento do Sul" },
  { country: "Brasil", state: "Santa Catarina", city: "São Francisco do Sul" },
  { country: "Brasil", state: "Santa Catarina", city: "São Joaquim" },
  { country: "Brasil", state: "Santa Catarina", city: "São José" },
  { country: "Brasil", state: "Santa Catarina", city: "São Ludgero" },
  { country: "Brasil", state: "Santa Catarina", city: "São Miguel do Oeste" },
  { country: "Brasil", state: "Santa Catarina", city: "Seara" },
  { country: "Brasil", state: "Santa Catarina", city: "Sombrio" },
  { country: "Brasil", state: "Santa Catarina", city: "Tijucas" },
  { country: "Brasil", state: "Santa Catarina", city: "Timbó" },
  { country: "Brasil", state: "Santa Catarina", city: "Tubarão" },
  { country: "Brasil", state: "Santa Catarina", city: "Urubici" },
  { country: "Brasil", state: "Santa Catarina", city: "Urussanga" },
  { country: "Brasil", state: "Santa Catarina", city: "Videira" },
  { country: "Brasil", state: "Santa Catarina", city: "Xanxerê" },

  // Paraná (neighboring state — major cities)
  { country: "Brasil", state: "Paraná", city: "Curitiba", ibgeCode: "4106902" },
  { country: "Brasil", state: "Paraná", city: "Londrina" },
  { country: "Brasil", state: "Paraná", city: "Maringá" },
  { country: "Brasil", state: "Paraná", city: "Ponta Grossa" },
  { country: "Brasil", state: "Paraná", city: "Cascavel" },
  { country: "Brasil", state: "Paraná", city: "Foz do Iguaçu" },
  { country: "Brasil", state: "Paraná", city: "Guarapuava" },
  { country: "Brasil", state: "Paraná", city: "Paranaguá" },

  // Rio Grande do Sul (neighboring state — major cities)
  { country: "Brasil", state: "Rio Grande do Sul", city: "Porto Alegre", ibgeCode: "4314902" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Caxias do Sul" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Pelotas" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Santa Maria" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Passo Fundo" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Gramado" },
  { country: "Brasil", state: "Rio Grande do Sul", city: "Torres" },

  // São Paulo (major cities)
  { country: "Brasil", state: "São Paulo", city: "São Paulo", ibgeCode: "3550308" },
  { country: "Brasil", state: "São Paulo", city: "Campinas" },
  { country: "Brasil", state: "São Paulo", city: "Santos" },
  { country: "Brasil", state: "São Paulo", city: "Ribeirão Preto" },
  { country: "Brasil", state: "São Paulo", city: "São José dos Campos" },

  // Rio de Janeiro
  { country: "Brasil", state: "Rio de Janeiro", city: "Rio de Janeiro", ibgeCode: "3304557" },
  { country: "Brasil", state: "Rio de Janeiro", city: "Niterói" },
  { country: "Brasil", state: "Rio de Janeiro", city: "Petrópolis" },

  // Minas Gerais
  { country: "Brasil", state: "Minas Gerais", city: "Belo Horizonte", ibgeCode: "3106200" },
  { country: "Brasil", state: "Minas Gerais", city: "Uberlândia" },

  // Other state capitals
  { country: "Brasil", state: "Bahia", city: "Salvador" },
  { country: "Brasil", state: "Ceará", city: "Fortaleza" },
  { country: "Brasil", state: "Distrito Federal", city: "Brasília" },
  { country: "Brasil", state: "Espírito Santo", city: "Vitória" },
  { country: "Brasil", state: "Goiás", city: "Goiânia" },
  { country: "Brasil", state: "Mato Grosso", city: "Cuiabá" },
  { country: "Brasil", state: "Mato Grosso do Sul", city: "Campo Grande" },
  { country: "Brasil", state: "Pará", city: "Belém" },
  { country: "Brasil", state: "Paraíba", city: "João Pessoa" },
  { country: "Brasil", state: "Pernambuco", city: "Recife" },
  { country: "Brasil", state: "Piauí", city: "Teresina" },
  { country: "Brasil", state: "Rio Grande do Norte", city: "Natal" },
  { country: "Brasil", state: "Sergipe", city: "Aracaju" },
  { country: "Brasil", state: "Alagoas", city: "Maceió" },
  { country: "Brasil", state: "Amapá", city: "Macapá" },
  { country: "Brasil", state: "Amazonas", city: "Manaus" },
  { country: "Brasil", state: "Maranhão", city: "São Luís" },
  { country: "Brasil", state: "Rondônia", city: "Porto Velho" },
  { country: "Brasil", state: "Roraima", city: "Boa Vista" },
  { country: "Brasil", state: "Tocantins", city: "Palmas" },
  { country: "Brasil", state: "Acre", city: "Rio Branco" },
];

async function main() {
  console.log("Seeding locations...");

  // Clear existing
  await prisma.location.deleteMany();

  for (const loc of locations) {
    await prisma.location.create({ data: loc });
  }

  const count = await prisma.location.count();
  console.log(`Seeded ${count} locations.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
