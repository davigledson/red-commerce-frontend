'use client'
import { useState } from "react";
import CardProduto from '@/components/CardProduto';
import Banner from '@/components/Banner';
import FilterSidebar from '@/components/FilterSidebar';
import CarrinhoSidebar from '@/components/CarrinhoSidebar';

export default function Produtos() {
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((prev) => [...prev, produto]);
    setCarrinhoAberto(true);
  };

  const removerDoCarrinho = (index) => {
    setItensCarrinho((prev) => prev.filter((_, i) => i !== index));
  };

  const produtos = Array.from({ length: 30 }).map((_, i) => ({
    id: String(i + 1),
    nome: `Hortelã ${i + 1}`,
    especie: "(Mentha spicata)",
    preco: (40 + i).toFixed(2).replace('.', ','),
    imagem: "planta.png",
  }));

  return (
    <div className="relative min-h-screen">
      <CarrinhoSidebar
        aberto={carrinhoAberto}
        itens={itensCarrinho}
        onClose={() => setCarrinhoAberto(false)}
        onRemoverItem={removerDoCarrinho}
      />

      <div className="space-y-6 p-6">
        <Banner
          titulo="MUDAS"
          descricao="Encontre mudas saudáveis e prontas para florescer no seu jardim. Frutíferas, ornamentais e muito mais!"
          imagem="banner1.jpg"
        />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <CardProduto 
                  key={produto.id} 
                  {...produto} 
                  onAddCarrinho={() => adicionarAoCarrinho(produto)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}