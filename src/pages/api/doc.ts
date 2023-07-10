import { withSwagger } from 'next-swagger-doc';
import readSwagger from "@/lib/swagger";

const specData = readSwagger();
const swaggerHandler = withSwagger(specData);
export default swaggerHandler();
