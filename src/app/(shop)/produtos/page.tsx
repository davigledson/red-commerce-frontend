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
            <CardProduto id="1" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="2" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="3" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="4" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="5" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="6" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="7" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="8" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="9" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="10" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="11" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="12" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="13" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="14" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="15" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="16" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="17" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="18" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="19" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="20" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="21" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="22" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="23" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="24" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="25" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="26" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="27" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="28" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="29" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
            <CardProduto id="30" nome="Hortelã" especie="(Mentha spicata)" preco="40,00" imagem="planta.png" />
          </div>
        </div>
      </div>
    </div>
  );
}