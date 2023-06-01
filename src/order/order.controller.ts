import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Req, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Roles } from "src/decorotors/roles-decorotor";
import { OrderStatus, RoleType } from "@prisma/client";
import { UpdateStatusDto } from "./Dto/update-status.dto";


@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService){};

    @Get()
    public async getAllOrders(
        @Req() { user }
    ){
        return this.orderService.getAllOrders(user);
    } 

    @Get('create')
    public async createOrder(
        @Req() { user }
    ){
        return this.orderService.createOrder(user);
    }

    // @Get('delete')
    // public async deleteOrder(){
    //     return this.orderService.deleteOrder();
    // }

    @Patch('status/:id')
    @Roles(RoleType.SELLER, RoleType.ADMIN)
    public async updateStatus(
        @Param('id', ParseUUIDPipe) orderId,
        @Req() { user },
        @Body() updateStatusDto: UpdateStatusDto
    ){
        return this.orderService.updateStatus(user, updateStatusDto, orderId);
    }
}