import Breadcrumb from '../../components/Breadcrumb';
import TableThree from '../../components/TableThree';
import useFetch from '../../hooks/usefetch';
import DefaultLayout from '../../layout/DefaultLayout';
import { useState } from 'react';
import Modal from '../../components/Modal';
import { api } from '../../services';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { FormCategory } from '../../components/FormCategory';
import TableThreeCategory from '../../components/TableThreeCategory';
import TableThreePedidos from '../../components/TableThreePedidos';

type officilProps = {
  id: string;
};

export const Pedidos = () => {
  const { data: Pedidos } = useFetch('/order');
  console.log(Pedidos);
  

  console.log(Pedidos);

  const [item, setItem] = useState<officilProps>({id: ''});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModalEdit = async (item: officilProps) => {
    const resp = confirm(
      `Tens certeza que queres confirmar que este pedido ${item?.produto?.nome} foi entregue`
    );
    if (resp) {
      try {
        const response = await api.put(`/order/${item?.id}`, {status: "aceite"});
        if (response) {
          mutate('/order');
          toast.success('Pedido confirmado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
    setIsOpenEdit(true);
  };
  const onReject = async (item: officilProps) => {
    const resp = confirm(
      `Tens certeza que queres rejeitar este pedido ${item?.produto?.nome}`
    );
    if (resp) {
      try {
        const response = await api.put(`/order/${item?.id}`, {status: "negado"});
        if (response) {
          mutate('/order');
          toast.success('Pedido rejeitado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
    setIsOpenEdit(true);
  };

  const onConfirm = async (item: officilProps) => {
    const resp = confirm(
      `Tens certeza que queres confirmar este pedido como entregue ${item?.produto?.nome}`
    );
    if (resp) {
      try {
        const response = await api.put(`/order/${item?.id}`, {status: "entregue"});
        if (response) {
          mutate('/order');
          toast.success('Pedido rejeitado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
    setIsOpenEdit(true);
  };
  const onCancel = async (item: officilProps) => {
    const resp = confirm(
      `Tens certeza que queres anular este pedido ${item?.produto?.nome}`
    );
    if (resp) {
      try {
        const response = await api.put(`/order/${item?.id}`, {status: "cancelado"});
        if (response) {
          mutate('/order');
          toast.success('Pedido rejeitado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
    setIsOpenEdit(true);
  };
  const closeModalEdit = () => {
    setIsOpenEdit(false);
  };

  async function onRemove(item: { id: string; produto: { nome: string } }) {
    const resp = confirm(
      `Tens certeza que queres eliminar este pedido ${item?.produto?.nome} `
    );
    if (resp) {
      try {
        const response = await api.delete(`/order/${item?.id}`);
        if (response) {
          mutate('/order');
          toast.success('Pedido deletado com sucesso');
        }
      } catch (err: any) {
        toast.error(err?.error?.message);
      }
    }
  }

  return (
    <DefaultLayout>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="mb-4 text-xl font-bold">Listar Pedidos</h2>
        <FormCategory onclose={closeModal} />
      </Modal>

      {/* <Modal isOpen={isOpenEdit} onClose={closeModalEdit}>
        <h2 className="mb-4 text-xl font-bold">Actulizar Categoria</h2>
        <FormCategoryEdit onclose={closeModalEdit} item={item} />
      </Modal> */}

      <Breadcrumb pageName="Pedidos" />

      {/* <!-- ====== Calendar Section Start ====== --> */}
      {/* <div className="flex flex-1 justify-end py-2">
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Adicionar
        </button>
      </div> */}
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <TableThreePedidos
          heads={['Nome do Produto', 'Nome do Cliente', 'Localização', 'Status', 'Acção']}
          data={Pedidos}
          onSucess={openModalEdit}
          onCancel={onReject}
          onEntregue={onConfirm}
          onRecusado={onCancel}
        />
      </div>
      {/* <!-- ====== Calendar Section End ====== --> */}
    </DefaultLayout>
  );
};
