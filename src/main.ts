import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ParamsValidationPipe } from './infrastructure/pipe/params.validation.pipe';
import { ResponseErrorExceptionFilter } from './infrastructure/filter/response.error.exception.filter';
import { ResponseSuccessTransformInterceptor } from './infrastructure/interceptor/response.success.transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('awn-grass server')
    .setDescription('the awn-grass api')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ParamsValidationPipe());
  app.useGlobalFilters(new ResponseErrorExceptionFilter());
  app.useGlobalInterceptors(new ResponseSuccessTransformInterceptor());
  await app.listen(3000, () => {
    console.log(
      `application started successfully, swagger address: http://127.0.0.1:3000/`,
    );
  });
}
bootstrap();
