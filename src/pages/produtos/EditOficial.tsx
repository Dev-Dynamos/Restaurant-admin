import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { api } from '../../services';
import { mutate } from 'swr';
import React from 'react';
import useFetch from '../../hooks/usefetch';

type officilProps = {
  id: string;
  nome: string;
  preco: number;
  ficheiroId: string;
  categoriaId: string;
  descricao: string
};
type formProps = {
  onclose: () => void;
  item: officilProps;
};

export const FormOfficialEdit: React.FC<formProps> = ({ item }) => {
  const { data: Categoria } = useFetch("/category")
  const formik = useFormik({
    initialValues: {
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      ficheiroId: item.ficheiroId,
      categoriaId: item.categoriaId,
      descricao: item?.descricao
    },
    validationSchema: yup.object({
      nome: yup.string().required('Este campo é obrigatório'),
      ficheiroId: yup.string().required('Este campo é obrigatório'),
      preco: yup.string().required('Este campo é obrigatório'),
      descricao: yup.string().required('Este campo é obrigatório'),
      categoriaId: yup.string().required()
    }),
    onSubmit: async (fields) => {
      if(fields?.ficheiroId === item?.ficheiroId) {
        try {
          const response = await api.put(`/product/${fields?.id}`, fields);
          if (response?.data) {
            mutate('/funcionarios');
            toast.success('funcionario actualizado com sucesso');
          }
        } catch (err: any) {
          toast.error(err?.error?.message);
        }
      }else{
        const ficheiroId = await getFile(fields?.ficheiroId[0])
          
        if (ficheiroId && ficheiroId.id) {
          const productData = { ...fields, ficheiroId: ficheiroId.id };
          const response = await api.put(`/product/${fields?.id}`, productData);
          if (response?.data) {
            mutate('/funcionarios');
            toast.success('funcionario actualizado com sucesso');
          }
        }
      }
    }
  });

  const getFile = async (ficheiroId:any) => {
    const formData = new FormData();
    formData.append("file", ficheiroId);
    const fileUploadResponse = (await api.post(`/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })).data;
    return fileUploadResponse;
   }

  return (
    <>
      <div className="flex  w-full flex-col overflow-scroll">
        <div className="rounded-sm bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={formik.handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Insira um nome"
                    id="nome"
                    name="nome"
                    value={formik.values.nome}
                    onChange={formik.handleChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>


              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Preço <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Insira o valor do preço"
                  id="preco"
                  name="preco"
                  value={formik.values.preco}
                  onChange={formik.handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Descricao <span className="text-meta-1">*</span>
                </label>
                <textarea
                  placeholder="Descrição"
                  id="descricao"
                  name="descricao"
                  value={formik.values.descricao}
                  onChange={formik.handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
              <div className='mb-4.5'>
              <input
                type="file"
                name="ficheiroId"
                accept="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue("ficheiroId", event.currentTarget.files);
                }}
              />
              </div>
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Categoria <span className="text-meta-1">*</span>
                </label>
                <select 
                  name="categoriaId"
                  id="categoriaId"
                  value={formik.values.categoriaId}
                  onChange={formik.handleChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option key={""} value={""}>selecione uma categoria</option>
                  {Categoria?.map((item: {id: string; nome: string}) => (
                    <>
                      <option key={item.id} value={item.id}>{item.nome}</option>
                    </>
                  ))} 
                </select>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
