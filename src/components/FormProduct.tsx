import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { api } from '../services';
import { mutate } from 'swr';
import React from 'react';
import useFetch from '../hooks/usefetch';

type formProps = {
  onclose: () => void;
};

export const FormProduct: React.FC<formProps> = () => {
  const { data: Categoria } = useFetch("/category")
  const formik = useFormik({
    initialValues: {
      nome: '',
      preco: 0,
      categoriaId: '',
      ficheiroId: '',
      descricao: ''
    },
    validationSchema: yup.object({
      nome: yup.string().required('Este campo é obrigatório'),
      preco: yup.number().required('Este campo é obrigatório'),
      categoriaId: yup.string().required('Este campo é obrigatório'),
      ficheiroId: yup.string().required('Este campo é obrigatório'),
      descricao: yup.string().required('Este campo é obrigatório'),
    }),
    onSubmit: async (fields) => {
      try {    
        const ficheiroId = await getFile(fields?.ficheiroId[0])
        console.log(ficheiroId, "sksksk");
                
        if (ficheiroId && ficheiroId.id) {
          const productData = { ...fields, ficheiroId: ficheiroId.id };
          const productResponse = (await api.post('/product', productData)).data;
    
          if (productResponse) {
            mutate('/product');
            formik.resetForm();
            toast.success('Produto cadastrado com sucesso');
          }
        } else {
          toast.error('Ocorreu um erro ao fazer upload do arquivo');
        }
      } catch (err:any) {
        toast.error(err?.error?.error || 'Ocorreu um erro no servidor');
      }
    },
    
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
              <div>
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
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
