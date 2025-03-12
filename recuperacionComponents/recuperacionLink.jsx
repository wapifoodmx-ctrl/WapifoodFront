import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Header from "@/components/Header";

export default function RecuperacionLink() {

    const router = useRouter();

    const initialValues = {
        email: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("Correo electrónico es requerido"),
    });

    const onSubmit = (values, { setSubmitting }) => {
        console.log(JSON.stringify(values));
        alert("Se ha enviado un enlace de recuperación a tu correo electrónico");
        setSubmitting(false);
        router.push("/login");
    };
    return (


        <>
            <Header />

            <div className="flex justify-center items-center min-h-screen bg-[#3fe283]">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-4xl text-center font-bold text-black">
                        Recuperar Contraseña
                    </h2>
                    <p className="text-center text-black text-lg mt-4">
                        Ingresa tu correo electrónico para recibir un enlace de recuperación
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
                                        type="email"
                                        name="email"
                                        placeholder="Correo electrónico"
                                        className="p-2 border border-gray-300 rounded-lg w-full"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#3fe283] text-white p-2 rounded-lg"
                                    disabled={isSubmitting}
                                >
                                    Enviar Enlace de Recuperación
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>


    )

}