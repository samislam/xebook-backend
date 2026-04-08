import { ZodResponse } from 'nestjs-zod'
import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/rate-snapshots/rate-snapshots.openapi'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { RateSnapshotsService } from '@/rate-snapshots/rate-snapshots.service'
import { CreateRateSnapshotDto } from '@/rate-snapshots/dto/create-rate-snapshot.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ListRateSnapshotsQueryDto } from '@/rate-snapshots/dto/list-rate-snapshots-query.dto'
import { WrappedRateSnapshotResponseZodDto } from '@/rate-snapshots/dto/rate-snapshot-responses.dto'
import { PaginatedRateSnapshotResponseZodDto } from '@/rate-snapshots/dto/rate-snapshot-responses.dto'

@ApiTags('Rate Snapshots')
@ApiBearerAuth()
@Controller({ path: 'rate-snapshots', version: '1' })
export class RateSnapshotsController {
  constructor(private readonly rateSnapshotsService: RateSnapshotsService) {}

  @ApiOperation(openapi.rateSnapshotsCreateOperation)
  @ApiBody(openapi.rateSnapshotsCreateBody)
  @ZodResponse({ type: WrappedRateSnapshotResponseZodDto, status: 201 })
  @Post()
  async create(@Body() dto: CreateRateSnapshotDto) {
    return { data: await this.rateSnapshotsService.create(dto) }
  }

  @ApiOperation(openapi.rateSnapshotsListOperation)
  @ZodResponse({ type: PaginatedRateSnapshotResponseZodDto, status: 200 })
  @Get()
  list(@Query() query: ListRateSnapshotsQueryDto) {
    return this.rateSnapshotsService.list(query)
  }

  @ApiOperation(openapi.rateSnapshotsFindOneOperation)
  @ApiParam(openapi.rateSnapshotIdParam)
  @ZodResponse({ type: WrappedRateSnapshotResponseZodDto, status: 200 })
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.rateSnapshotsService.findOne(params.id) }
  }
}
