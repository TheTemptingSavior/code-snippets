import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from 'next-swagger-doc';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import readSwagger from "@/lib/swagger";


// @ts-ignore
const SwaggerUI = dynamic<{ spec: any; }>(import('swagger-ui-react'), { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SwaggerUI spec={spec} />;
}


export const getStaticProps: GetStaticProps = async () => {
  const specData = readSwagger();
  const spec: Record<string, any> = createSwaggerSpec(specData);

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
