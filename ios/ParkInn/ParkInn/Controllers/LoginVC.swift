//
//  ViewController.swift
//  ParkInn
//
//  Created by Kyle Aquino on 2/11/20.
//  Copyright © 2020 ParkInn. All rights reserved.
//

import UIKit
import Auth0
import SimpleKeychain

class LoginVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        Auth0
            .webAuth()
            .clearSession(federated:false) { [weak self] in
                switch $0 {
                    case true:
                        print("logged out")
                    case false:
                        print("logged out failed")
                }
        }
    }

    @IBAction func loginPressed(_ sender: Any) {
        checkAccessToken()
    }

    func showLock() {
        Auth0
            .webAuth()
            .scope("openid profile")
            .audience("https://parkinn.auth0.com/userinfo")
            .start {
                switch $0 {
                    case .failure(let error):
                        // Handle the error
                        print("Error: \(error)")
                    case .success(let credentials):
                        guard let accessToken = credentials.accessToken,
                            let idToken = credentials.idToken else {
                                // Handle Error
                                return
                        }
                        // Save the tokens in SessionManager
                        SessionManager.shared.storeTokens(accessToken, idToken: idToken)
                        SessionManager.shared.retrieveProfile { error in
                            guard error == nil else {
                                return self.showLock()
                            }
                            DispatchQueue.main.async {
                                 guard let roleString = SessionManager.shared.profile!.nickname,
                                                       let role = UserRole(rawValue: roleString) else { return }
                                self.goToNextPage(using: role)
                            }
                    }
                }
        }
    }

    fileprivate func checkAccessToken() {
        let loadingAlert = UIAlertController.loadingAlert()
        loadingAlert.presentInViewController(viewController: self)
        SessionManager.shared.retrieveProfile { error in
            DispatchQueue.main.async {
                loadingAlert.dismiss(animated: true) {
                    guard error == nil else {
                        return self.showLock()
                    }
                    guard let roleString = SessionManager.shared.profile!.nickname,
                        let role = UserRole(rawValue: roleString) else { return }
                    self.goToNextPage(using: role)
                }
            }
        }
    }

    fileprivate func goToNextPage(using role: UserRole) {
        switch role {
            case .admin, .staff:
                self.performSegue(withIdentifier: "toMainVC", sender: nil)
            case .customer:
                // Segue to user side
                print("Should have gone to user side")
        }
    }

}

