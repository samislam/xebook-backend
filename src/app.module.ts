import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from '@/modules/auth/auth.module'
import { UsersModule } from '@/modules/users/users.module'
import { DatabaseModule } from '@/database/database.module'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { OrdersModule } from '@/modules/orders/orders.module'
import { HttpExceptionFilter } from '@/common/filters/zod.filter'
import { environmentVarsSchema } from '@/server/environment-schema'
import { BalancesModule } from '@/modules/balances/balances.module'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { RequestUserMiddleware } from '@/middlewares/request-user.middleware'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { InstitutionsModule } from '@/modules/institutions/institutions.module'
import { TransactionsModule } from '@/modules/transactions/transactions.module'
import { DebtBalancesModule } from '@/modules/debt-balances/debt-balances.module'
import { HeldBalancesModule } from '@/modules/held-balances/held-balances.module'
import { RequestPreviewMiddleware } from '@/middlewares/request-preview.middleware'
import { CounterpartiesModule } from '@/modules/counterparties/counterparties.module'
import { InstitutionAccountsModule } from '@/modules/institution-accounts/institution-accounts.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => environmentVarsSchema.parse(env),
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    OrdersModule,
    BalancesModule,
    InstitutionsModule,
    HeldBalancesModule,
    DebtBalancesModule,
    TransactionsModule,
    CounterpartiesModule,
    InstitutionAccountsModule,
  ],
  providers: [
    {
      // Protect all routes by default unless a handler is marked public.
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // Validate incoming request payloads and query params using zod DTO schemas.
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      // Normalize zod-based response serialization for routes that use serializer DTOs.
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      // Log and surface zod serialization errors through a shared exception filter.
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestPreviewMiddleware).forRoutes('*')
    consumer.apply(RequestUserMiddleware).forRoutes('*')
  }
}
