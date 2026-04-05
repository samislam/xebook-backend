import { IdParamDto } from '@/common/dtos/id-param.dto'
import * as openapi from '@/rate-snapshots/rate-snapshots.openapi'
import { RateSnapshotsService } from '@/rate-snapshots/rate-snapshots.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { CreateRateSnapshotDto } from '@/rate-snapshots/dto/create-rate-snapshot.dto'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ListRateSnapshotsQueryDto } from '@/rate-snapshots/dto/list-rate-snapshots-query.dto'

@ApiTags('Rate Snapshots')
@ApiBearerAuth()
@Controller({ path: 'rate-snapshots', version: '1' })
export class RateSnapshotsController {
  constructor(private readonly rateSnapshotsService: RateSnapshotsService) {}

  @ApiOperation(openapi.rateSnapshotsCreateOperation)
  @ApiBody(openapi.rateSnapshotsCreateBody)
  @Post()
  async create(@Body() dto: CreateRateSnapshotDto) {
    return { data: await this.rateSnapshotsService.create(dto) }
  }

  @ApiOperation(openapi.rateSnapshotsListOperation)
  @Get()
  list(@Query() query: ListRateSnapshotsQueryDto) {
    return this.rateSnapshotsService.list(query)
  }

  @ApiOperation(openapi.rateSnapshotsFindOneOperation)
  @ApiParam(openapi.rateSnapshotIdParam)
  @Get(':id')
  async findOne(@Param() params: IdParamDto) {
    return { data: await this.rateSnapshotsService.findOne(params.id) }
  }
}
