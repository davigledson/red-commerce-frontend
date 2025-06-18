'use client';

import { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
  Textarea,
} from 'flowbite-react';

export default function EditModal({ open, product, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', price: '', category: '', description: '' });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: String(product.price),
        category: product.category[0] || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...product,
      name: form.name,
      price: parseFloat(form.price),
      category: [form.category],
      description: form.description,
    };
    onSave(updated);
  };

  return (
    <Modal show={open} onClose={onClose} popup dismissible>
      <ModalHeader>Editar Produto</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name" value="Nome" />
              <TextInput id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="price" value="Preço" />
              <TextInput id="price" name="price" type="number" value={form.price} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="category" value="Categoria" />
              <TextInput id="category" name="category" value={form.category} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="description" value="Descrição" />
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
