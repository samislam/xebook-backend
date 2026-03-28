import { ConfigModule } from '@nestjs/config'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod'
import { environmentVarsSchema } from '@/server/environment-schema'
import { DatabaseModule } from '@/database/database.module'
import { HttpExceptionFilter } from '@/common/filters/zod.filter'
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard'
import { RequestPreviewMiddleware } from '@/middlewares/request-preview.middleware'
import { RequestUserMiddleware } from '@/middlewares/request-user.middleware'
import { AuthModule } from '@/modules/auth/auth.module'
import { BalancesModule } from '@/modules/balances/balances.module'
import { CounterpartiesModule } from '@/modules/counterparties/counterparties.module'
import { DebtBalancesModule } from '@/modules/debt-balances/debt-balances.module'
import { HeldBalancesModule } from '@/modules/held-balances/held-balances.module'
import { InstitutionAccountsModule } from '@/modules/institution-accounts/institution-accounts.module'
import { InstitutionsModule } from '@/modules/institutions/institutions.module'
import { OrdersModule } from '@/modules/orders/orders.module'
import { TransactionsModule } from '@/modules/transactions/transactions.module'
import { UsersModule } from '@/modules/users/users.module'

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
    BalancesModule,
    UsersModule,
    CounterpartiesModule,
    InstitutionsModule,
    InstitutionAccountsModule,
    HeldBalancesModule,
    DebtBalancesModule,
    TransactionsModule,
    OrdersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
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
