import CardProduto from '@/components/CardProduto';
import Banner from '@/components/Banner';

export default function Produtos() {
  return (
    <div className="space-y-6 p-6">
      {/* Banner full-width */}
      <Banner
        titulo="MUDAS"
        descricao="Encontre mudas saudáveis e prontas para florescer no seu jardim. Frutíferas, ornamentais e muito mais!"
        imagem="banner1.jpg"
      />

      {/* Grid com os cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

        {/* …outros CardProduto */}
      </div>
    </div>
  );
}
