import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const newOffer = this.offerRepository.create(createOfferDto);

    return this.offerRepository.save(newOffer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    const offer = this.offerRepository.findOneBy({ id });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }
}
