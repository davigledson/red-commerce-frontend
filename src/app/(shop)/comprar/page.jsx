// src/app/cart/page.jsx
'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Para redirecionamento
import { useAuth } from '@/hooks/ContextoAuth';
import { useToast } from '@/hooks/ContextoToast'; // Importa o hook de toast
import { CarrinhoService } from '@/services/CarrinhoService';
import ItemCarrinhoService from '@/services/ItemCarrinhoService';
import ProdutoService from '@/services/ProdutoService'; // Para buscar detalhes do produto se necessário
import EnderecoService from '@/services/EnderecoService'; // Para buscar endereços do usuário
import Link from 'next/link'; 
import PedidoService from '@/services/PedidoService'; // Para criar o pedido
import axios from 'axios';

export default function Comprar() {
  const { loggedInUser, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  const [userCartId, setUserCartId] = useState(null);
  const [items, setItems] = useState([]); // Itens do carrinho com detalhes do produto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enderecos, setEnderecos] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // ID do endereço selecionado para entrega

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!authLoading && !loggedInUser) {
      addToast("Você precisa estar logado para acessar o carrinho.", "warning");
      router.push('/login');
    }
  }, [loggedInUser, authLoading, router, addToast]);

  // 1. Inicializa o carrinho do usuário (busca ou cria)
  useEffect(() => {
    const initializeUserCart = async () => {
      if (authLoading || !loggedInUser) {
        setLoading(true); // Mantém o loading enquanto autentica ou se não logado
        return;
      }

      if (userCartId) { // Se já temos o ID do carrinho, não precisamos buscar/criar novamente
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let cart;
        try {
          cart = await CarrinhoService.buscarPorUsuario(loggedInUser.id);
        } catch (err) {
          if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
            cart = await CarrinhoService.criar({ usuario_id: loggedInUser.id });
            addToast("Carrinho criado para sua conta!", "success");
          } else {
            throw err;
          }
        }
        setUserCartId(cart.id);
      } catch (err) {
        console.error("Erro ao inicializar o carrinho do usuário:", err);
        setError("Erro ao carregar ou criar o carrinho.");
        addToast("Erro ao inicializar seu carrinho. Tente novamente.", "error");
      } finally {
        setLoading(false);
      }
    };

    initializeUserCart();
  }, [loggedInUser, authLoading, userCartId, addToast]);

  // 2. Busca os itens do carrinho e detalhes do produto
  const fetchCartItems = useCallback(async () => {
    if (!userCartId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rawItems = await ItemCarrinhoService.listarPorCarrinho(userCartId);
      
      // Mapeia os itens do carrinho para incluir detalhes do produto
      // Assumimos que o backend já retorna o produto aninhado (item.produto)
      const detailedItems = rawItems.map(item => ({
        id: item.id, // ID do item_carrinho
        productId: item.produto_id, // ID do produto
        name: item.produto?.nome || 'Produto Desconhecido',
        category: item.produto?.categoria?.nome || 'Sem Categoria', // Adapte se tiver categoria
        price: parseFloat(item.produto?.preco || 0),
        image: item.produto?.imagem || '/imgs/planta.png', // Imagem do produto
        quantity: item.quantidade,
      }));
      setItems(detailedItems);
    } catch (err) {
      console.error("Erro ao carregar itens do carrinho:", err);
      setError("Erro ao carregar itens do carrinho.");
      addToast("Erro ao carregar itens do carrinho.", "error");
    } finally {
      setLoading(false);
    }
  }, [userCartId, addToast]);

  // 3. Busca os endereços do usuário
  const fetchEnderecos = useCallback(async () => {
    if (!loggedInUser || !loggedInUser.id) {
      setEnderecos([]);
      return;
    }
    try {
      const userEnderecos = await EnderecoService.listarPorUsuario(loggedInUser.id);
      setEnderecos(userEnderecos);
      // Seleciona o endereço principal por padrão, se houver
      const principalAddress = userEnderecos.find(addr => addr.principal);
      if (principalAddress) {
        setSelectedAddressId(principalAddress.id);
      } else if (userEnderecos.length > 0) {
        setSelectedAddressId(userEnderecos[0].id); // Seleciona o primeiro se não houver principal
      }
    } catch (err) {
      console.error("Erro ao carregar endereços:", err);
      addToast("Erro ao carregar seus endereços.", "error");
    }
  }, [loggedInUser, addToast]);

  // Dispara a busca de itens e endereços quando o carrinho/usuário está pronto
  useEffect(() => {
    if (userCartId) {
      fetchCartItems();
    }
    if (loggedInUser) {
      fetchEnderecos();
    }
  }, [userCartId, loggedInUser, fetchCartItems, fetchEnderecos]);

  // Atualiza quantidade de um item no carrinho (backend)
  const updateQuantity = async (itemId, delta) => {
    const currentItem = items.find(item => item.id === itemId);
    if (!currentItem) return;

    const newQty = currentItem.quantity + delta;
    if (newQty <= 0) {
      // Se a nova quantidade for 0 ou menos, remove o item
      await removeItem(itemId);
      return;
    }

    setLoading(true);
    try {
      await ItemCarrinhoService.atualizarQuantidade(itemId, newQty);
      await fetchCartItems(); // Recarrega os itens após a atualização
      addToast("Quantidade atualizada!", "success");
    } catch (err) {
      console.error("Erro ao atualizar quantidade:", err);
      addToast("Erro ao atualizar quantidade.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Remove um item do carrinho (backend)
  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      await ItemCarrinhoService.remover(itemId);
      await fetchCartItems(); // Recarrega os itens após a remoção
      addToast("Item removido do carrinho!", "success");
    } catch (err) {
      console.error("Erro ao remover item:", err);
      addToast("Erro ao remover item.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Calcula subtotal
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Finalizar Compra (Criar Pedido)
  const handleFinalizarCompra = async () => {
    if (!loggedInUser || !loggedInUser.id) {
      addToast("Você precisa estar logado para finalizar a compra.", "warning");
      return;
    }
    if (items.length === 0) {
      addToast("Seu carrinho está vazio!", "warning");
      return;
    }
    if (!selectedAddressId) {
      addToast("Por favor, selecione um endereço de entrega.", "warning");
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        produto_id: item.productId,
        quantidade: item.quantity,
        preco: item.price,
      }));

      const newOrder = await PedidoService.criar({
        endereco_entrega_id: selectedAddressId,
        itens: orderItems,
      });

      // Limpar o carrinho após o pedido ser criado
      await CarrinhoService.limpar(userCartId);
      await fetchCartItems(); // Atualiza a lista de itens do carrinho para vazio

      addToast("Pedido realizado com sucesso!", "success");
      router.push(`/perfil?tab=orders`); // Redireciona para a página do pedido
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      let errorMessage = "Erro ao finalizar compra. Por favor, tente novamente.";
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        if (err.response.data.errors) {
          errorMessage = err.response.data.errors.join(', ');
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      addToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Renderização de carregamento e erro
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-lg text-gray-700">Carregando carrinho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md">
          <h3 className="mt-4 text-xl font-medium text-gray-900">Erro ao carregar carrinho</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto mt-20 p-10 grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 scale-[1.05]">
      {/* Lista de itens */}
      <div className="space-y-8">
        <h1 className="text-5xl font-bold">Seu carrinho</h1>

        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="text-center py-10 text-gray-600 text-lg">
              Seu carrinho está vazio.
              <p className="mt-2">
                <Link href="/produtos" className="text-green-600 hover:underline">
                  Continue comprando
                </Link>
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-left table-auto border-separate border-spacing-y-6 text-xl">
              <thead className="text-gray-600 text-lg uppercase">
                <tr>
                  <th className="pl-4 py-4">Produto</th>
                  <th className="py-4">Preço</th>
                  <th className="py-4">Quantidade</th>
                  <th className="py-4">Total</th>
                  <th className="py-4"></th>
                </tr>
              </thead>

              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="bg-white shadow rounded-xl">
                    <td className="flex items-center gap-6 pl-4 py-6">
                      <div className="w-28 h-28 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{item.name}</div>
                        <div className="text-gray-500 text-base">{item.category}</div>
                      </div>
                    </td>

                    <td className="font-semibold py-6">R$ {item.price.toFixed(2)}</td>

                    <td>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          –
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, +1)}
                          className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="font-semibold py-6">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </td>

                    <td className="py-6">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 text-xl"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Resumo da compra */}
      <div className="bg-gray-50 p-8 rounded-lg shadow text-base">
        <h2 className="text-2xl font-semibold mb-4">Resumo da compra</h2>
        <div className="flex justify-between mb-2">
          <span>Sub‑total</span>
          <span>R$ {subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Frete</span>
          <span className="text-green-600 font-medium">Gratuito</span>
        </div>
        <button className="text-green-600 text-sm underline mb-4">
          Adicionar cupom de desconto →
        </button>
        <div className="flex justify-between items-center font-bold text-lg mb-6">
          <span>Total</span>
          <span>R$ {subTotal.toFixed(2)}</span>
        </div>

        {/* Seleção de Endereço */}
        <div className="mb-6">
          <label htmlFor="address-select" className="block text-lg font-semibold text-gray-700 mb-2">
            Endereço de Entrega
          </label>
          {enderecos.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhum endereço cadastrado. Por favor, adicione um endereço no seu{' '}
              <Link href="/perfil" className="text-green-600 hover:underline">
                perfil
              </Link>
              .
            </p>
          ) : (
            <select
              id="address-select"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedAddressId || ''}
              onChange={(e) => setSelectedAddressId(parseInt(e.target.value))}
            >
              {enderecos.map(addr => (
                <option key={addr.id} value={addr.id}>
                  {addr.rua}, {addr.numero} - {addr.cidade}/{addr.estado} {addr.complemento && `(${addr.complemento})`}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={handleFinalizarCompra}
          className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-800"
          disabled={items.length === 0 || !selectedAddressId || loading} // Desabilita se carrinho vazio, sem endereço ou carregando
        >
          Finalizar compra
        </button>
      </div>
    </div>
  );
}
