import * as infractionsRepository from "../../src/infractions-repository";
import * as userInfractionsFactory from "../integration/factories/user-infractions-factory";
import * as usersRepository from "../../src/users-repository";
import * as infractionsService from "../../src/infractions-service";
import { faker } from "@faker-js/faker";
import { Level } from "@prisma/client";

describe("Infractions Service Tests", () => {
  it("should get infractions from user", async () => {
    const userInfractions = [];
    const userId = 1;
    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((licenseId: string): any => {
        return {
          id: userId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          licenseId: licenseId,
        };
      });

    jest
      .spyOn(userInfractionsFactory, "getLevel")
      .mockImplementationOnce((): Level => {
        return "LIGHT";
      });

    jest
      .spyOn(userInfractionsFactory, "generateUserWithNInfractions")
      .mockImplementation((nInfractions: number): any => {
        const user = {
          id: userId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          licenseId: faker.internet.ipv4().replace("/./g", ""),
        };
        for (let i = 0; i < nInfractions; i++) {
          const infractionData = {
            userId: user.id,
            date: new Date(),
            cost: faker.number.int({ min: 100, max: 1000 }),
            level: userInfractionsFactory.getLevel(),
            description: faker.company.catchPhrase(),
          };
          userInfractions.push(infractionData);
        }
        return user;
      });

    jest
      .spyOn(infractionsRepository, "getInfractionsFrom")
      .mockImplementationOnce((userId: number): any => {
        return userInfractions;
      });

    const user = await userInfractionsFactory.generateUserWithNInfractions(5);
    const { licenseId } = user;

    const { infractions } = await infractionsService.getInfractionsFrom(
      licenseId
    );

    expect(infractions).toHaveLength(5);
  });

  it("should throw an error when driver license does not exists", async () => {
    jest
      .spyOn(userInfractionsFactory, "generateUserWithNInfractions")
      .mockImplementation((): any => {
        return {
          id: faker.number.int(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          licenseId: faker.internet.ipv4().replace("/./g", ""),
        };
      });

    jest
      .spyOn(usersRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return undefined;
      });

    const generatedUser =
      await userInfractionsFactory.generateUserWithNInfractions();
    const { licenseId } = generatedUser;
    const promise = infractionsService.getInfractionsFrom(licenseId);

    expect(promise).rejects.toEqual({
      message: "Driver not found.",
      type: "NOT_FOUND",
    });
  });
});
