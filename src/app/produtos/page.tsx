import CardProduto from '@/components/CardProduto';
import Banner from '@/components/Banner';
import FilterSidebar from '@/components/FilterSidebar';

export default function Produtos() {
  return (
    <div className="space-y-6 p-6">
      {/* Banner full-width */}
      <Banner
        titulo="MUDAS"
        descricao="Encontre mudas saudáveis e prontas para florescer no seu jardim. Frutíferas, ornamentais e muito mais!"
        imagem="banner1.jpg"
      />

      {/* Layout com sidebar fixo */}
      <div className="flex gap-6">
        {/* Sidebar fixo no lado esquerdo */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-6">
            <FilterSidebar />
          </div>
        </div>

        {/* Conteúdo principal com grid de produtos */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
          </div>
        </div>
      </div>
    </div>
  );
}