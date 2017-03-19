import * as sinon from 'sinon';
import {expect} from 'chai';
import {Tenant} from "../../../../src/domain/Tenant";
import {DefaultTenantServiceImpl} from "../../../../src/services/tenant/impl/DefaultTenantServiceImpl";

describe('DefaultTenantServiceUnitTest', () => {

    it('it receives a saved tenant', () =>  {

        let newTenant = new Tenant("1","Microsoft", "cipriano.sanchez@microsoft.com", "1234", new Array());

        let tenantDaoMock = {
            save: sinon.stub().yields(undefined, newTenant)
        };

        let callback = sinon.spy();
        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        tenantService.registerNewTenant(newTenant, callback);
        // tenantService.registerNewTenant(newTenant, (err, tenant) => {
        //     expect(tenantDaoMock.save.calledWith(newTenant));
        // });

    });

    // it('it calls save with a correct tenant', () =>  {
    //
    //
    // });
});
