import { AuthInDto } from '../auth/auth.dto';
import { sha256String } from '../crypro.utils';
import { User } from '../entities/User.entity';
import AppDataSource from '../typeOrm.config';
import { UserInDto, UserOutDto } from '../user/user.dto';
import { userDBMapper } from '../user/user.mappers';

const getUserDBRepository = () => AppDataSource.getRepository(User);

export const userRepository = {
  createUser: async (data: UserInDto): Promise<UserOutDto> => {
    return userDBMapper(await getUserDBRepository().save(data));
  },
  findUserForLogin: async (data: AuthInDto): Promise<UserOutDto | null> => {
    const foundUser = await getUserDBRepository().findOne({
      where: { login: data.login, password: sha256String(data.password) },
    });
    if (!foundUser) {
      return null;
    }
    return userDBMapper(foundUser);
  },
};
