import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] }
    );
    app.enableCors({
        origin: [
            'http://localhost:3030',
            'http://localhost:4200'
        ]
    })

    const config = new DocumentBuilder()
        .setTitle('Spotify API')
        .setDescription('A personal API collecting playcount and popularity data of many artists from Spotify')
        .setVersion('1.0')
        .setContact('Mathieu Ducharme', 'https://github.com/SmoMeat', 'mathieuducharme86@gmail.com')
        .setContact('Christophe Simard', 'https://github.com/Binimow', 'cricorafi@gmail.com')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);


    await app.listen(3000);
}
bootstrap();
