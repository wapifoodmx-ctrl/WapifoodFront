import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function ResetPass() {
  const router = useRouter();
  const login = () => {
    router.push('/login');
}

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("Nueva contraseña es requerida"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Las contraseñas deben coincidir")
      .required("Confirmar nueva contraseña es requerida"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    console.log(JSON.stringify(values));
    setSubmitting(false);
    login();
    location.reload()
  };

  return (
    <>
    <Header />
      <div className="flex justify-center items-center h-screen bg-[#3fe283]">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-4xl text-center font-bold text-black">
            Nueva Contraseña
          </h2>
          <p className="text-center text-black text-lg mt-4">
            Ingresa tu nueva contraseña
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4 mt-4">
                <div>
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Nueva contraseña"
                    className="p-2 border border-gray-300 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirmar nueva contraseña"
                    className="p-2 border border-gray-300 rounded-lg w-full"
                  />
                  <ErrorMessage
                    name="confirmNewPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#3fe283] text-white p-2 rounded-lg"
                  disabled={isSubmitting}
                >
                  Actualizar Contraseña
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
