const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Kiragu',
            room: 'The Office Fans'
        },{
            id: '2',
            name: 'Steve',
            room: 'Scrubs Fans'
        }, {
            id: '3',
            name: 'Jobs',
            room: 'The Office Fans'
        }]
    });

    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: 'vndsjkcvn',
            name: 'Kiragu',
            room: 'The Office Fans'
        };

        let reUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return names for The Office fans', () => {
        let userList = users.getUserList('The Office Fans');
        expect(userList).toEqual(['Kiragu', 'Jobs']);
    });

    it('should return names for Scrubs Fans', () => {
        let userList = users.getUserList('Scrubs Fans');
        expect(userList).toEqual(['Steve']);
    });

    it('should find user', () => {
        let userID = '2',
            user = users.getUser(userID);

        expect(user.id).toBe(userID);
    });

    it('should not find user', () => {
        let userID = '150',
            user = users.getUser(userID);

        expect(user).toBeUndefined();
    });
    
    it('should remove a user', () => {
        let userID = '1',
        user = users.removeUser(userID);
        
        expect(user.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });
    
    it('should not remove a user', () => {
        let userID = '104',
            user = users.removeUser(userID);

        expect(user).toBeUndefined();
        expect(users.users.length).toBe(3);
    });
});